const User = require("../models/user"); // Importation du modèle utilisateur
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// Fonction pour enregistrer un nouvel utilisateur
const registerUser = async (req, res) => {
    const { email, password, nom, prenom, role, zone } = req.body; // Extraction des données du corps de la requête

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
        const user = User({email: email, password: hashedPassword , nom : nom, prenom: prenom, role: role, zone: zone}); // Création d'une nouvelle instance de l'utilisateur
        await user.save(); // Enregistrement de l'utilisateur dans la base de données
        res.status(201).json({ message: "Utilisateur enregistré avec succès" }); // Réponse de succès
    }catch (error){
        return res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur", error: error.message }); // Réponse d'erreur
    }
};

module.exports = {registerUser}; // Exportation de la fonction pour l'utiliser dans d'autres fichiers