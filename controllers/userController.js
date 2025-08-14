const User = require("../models/user"); // Importation du modèle utilisateur
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken, refreshToken} = require("../utility/security"); // Importation des fonctions de génération de token




// Fonction pour enregistrer un nouvel utilisateur
const registerUser = async (req, res) => {
    const { email, password, nom, prenom, role, zone } = req.body; // Extraction des données du corps de la requête

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
        const user = User({email: email, password: hashedPassword , nom : nom, prenom: prenom, role: role, zone: zone}); // Création d'une nouvelle instance de l'utilisateur
        await user.save(); // Enregistrement de l'utilisateur dans la base de données
        const accessToken = generateToken(user, user.role, user.isActive); // Génération du token d'accès
        const newRefreshToken = refreshToken(user); // Génération du token de rafraîchissement

        res.status(201).json({ message: "Utilisateur enregistré avec succès",user ,accessToken ,refreshToken: newRefreshToken }); // Réponse de succès
    }catch (error){
        return res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur", error: error.message }); // Réponse d'erreur
    }
};

// Function login user 
const loginUser = async (req, res) => {

    const {email, password} = req.body; // extration des données du corps de la requête
    if (req.body.attaque){
        return res.status(400).json({ message: "Tentative d'attaque détectée" }); // Réponse d'erreur en cas de tentative d'attaque
    }
    try {
        const user = await User.findOne({ email });//recherche de l'email founie
        if (!user){
            return res.status(404).json({ message: "utilisateur introuvable "}); // reponse d'en ca d'utilisatieur pas trouver 

        }
        const isPasswordValid = await bcrypt.compare(password, user.password);// verification du mot de passe
        if (!isPasswordValid) {
            return res.status(401).json({ message: "utilisateur introuvable"});// reponse en cas de passe incorrect  
        }
        //genere les tokens
        const accessToken = generateToken(user, user.role, user.isActive); // Génération du token d'accès
        const newRefreshToken = refreshToken(user); // Génération du token de rafraîchissement
        res.status(200).json({ message: "Connexion réussie", user: { id: user._id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role, zone: user.zone }, accessToken, refreshToken: newRefreshToken }); // Réponse de succès avec les informations de l'utilisateur
      
        
        
        // si l'utilisateur est actif
        //user.isActive = true;
        //user.refreshToken = refToken; // Mise à jour du token de rafraîchissement
        //await user.save(); // Enregistrement de l'utilisateur actif
    }catch (error){
        return res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur", error }); // Réponse d'erreur
    }
};

// RECUPERE TOUS La liste des utilisateur 
const getAllUsers = async (req, res) => {
    const adminId = req.body.adminId; // recuperation de l'id de l'admin
    if (!adminId){
        return res.status(401).json( { message: "admin id obligatoire"}); // reponse en cas d'admin non trouver
    }
    const user = await User.findById(adminId); // recherche de l'admin
    if (user.role === 'admin' || user.role === 'gerant'){
        const users = await User.find();// recherche de tous les utilisateurs
        return res.status(200).json({ message: "liste des utilisateurs", users }); // reponse de succès avec la liste des utilisateurs
    }
    return res.status(403).json({ message: "Accès interdit" }); // Réponse d'accès interdit si l'utilisateur n'est pas un admin ou gérant
};

const updateUser = async (req, res) => {
    try {
        const {id} = req.params; // recuperation de l'id de l'utilisateur
        const data = req.body; // les données à mettre à jour
        const user = await User.findByIdAndUpdate(id, data, {new: true}); //methode moogoose pour chercher l'id pour la mise a jour
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" }); // Réponse d'erreur si l'utilisateur n'est pas trouvé
        }
        res.status(200).json({ message: "Utilisateur mis à jour avec succès", user }); // Réponse de succès avec l'utilisateur mis à jour
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: error.message }); // Réponse d'erreur en cas d'erreur lors de la mise à jour


}
};

//supprimer un utilisateur 
const deleteUser = async (req, res) => {
    try {
        const {id} = req.params; // recuperation de l'id de l'utilisateur
        const user = await User.findByIdAndDelete(id); // methode moogoose pour chercher l'id pour la suppression
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" }); // Réponse d'erreur si l'utilisateur n'est pas trouvé
        }
        res.status(200).json({ message: "Utilisateur supprimé avec succès" }); // Réponse de succès après la suppression de l'utilisateur
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: error.message }); // Réponse d'erreur en cas d'erreur lors de la suppression
    }
};
const refreshAccessToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: "Token de rafraîchissement manquant" });
        }

        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Générer un nouveau access token
        const newAccessToken = generateToken(decoded.user, decoded.user.role, decoded.user.isActive);

        res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: "Token de rafraîchissement expiré" });
        }
        return res.status(403).json({ message: "Token de rafraîchissement invalide" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser,
    refreshAccessToken
};
// const refreshAccessToken = async (req, res) => {
//     try{
//        const { refreshToken: clientRefreshToken } = req.body ; // Récupération du token de rafraîchissement depuis le corps de la requête

//      if (!clientRefreshToken){
//         return res.status(401).json({ message: "Token de rafraîchissement manquant" }); // Réponse d'erreur si le token de rafraîchissement est manquant
//      }

//      const decoded = jwt.verify(clientRefreshToken, process.env.JWT_REFRESH_SECRET) // Vérification du token de rafraîchissement     


//     const user = await User.findById(decoded.user._id) // Recherche de l'utilisateur par son ID décodé
//     if (!user || user.refreshToken !== clientRefreshToken) {
//     return res.status(403).json({ message: "Token de rafraîchissement invalide" }); // Réponse d'erreur si l'utilisateur n'est pas trouvé ou si le token de rafraîchissement ne correspond pas
//   }


//   const newAccessToken = generateToken(user, user.role, user.isActive); // Génération d'un nouveau token d'accès
//   const newRefreshToken = refreshToken(user); // Génération d'un nouveau token de rafraîchissement
//   user.refreshToken = newRefreshToken; // Mise à jour du token de rafraîchissement de l'utilisateur
//   await user.save(); // Enregistrement de l'utilisateur avec le nouveau token de rafraîchissement

//   return res.status(200).json({ 
//     accessToken: newAccessToken, // Envoi du nouveau token d'accès
//     refreshToken: newRefreshToken, // Envoi du nouveau token de rafraîchissement
//     message: "Token de rafraîchissement réussi" // Message de succès
//    }); 
// }  catch (error) {
//     if (error.nome === 'jsonWebTokenError' || error.nome === 'TokenExpiredError') {
//         return res.status(403).json({ message: "Token de rafraîchissement invalide ou expiré" }); // Réponse d'erreur si le token de rafraîchissement est invalide ou expiré
//     }
//     return res.status(500).json({ message: "Erreur lors du rafraîchissement du token", error: error.message }); // Réponse d'erreur en cas d'erreur lors du rafraîchissement du token
//     }
// }; // Réponse de succès avec les nouveaux tokens

// // Exportation des fonctions pour les utiliser dans d'autres fichiers
// module.exports = {registerUser, loginUser, getAllUsers, updateUser, deleteUser, refreshAccessToken }; // Exportation de la fonction pour l'utiliser dans d'autres fichiers