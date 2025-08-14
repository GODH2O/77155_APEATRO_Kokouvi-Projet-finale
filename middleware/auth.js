const jwt =  require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); // Chargement des variables d'environnement depuis le fichier .env


//declaration du middleware d'authentification
const auth = (req, res, next) => { //
    // Recupére l'en-tete authorization envoye par le client 
    const tokenHeader = req.headers.authorizotion;

    if (!tokenHeader) {// Si l'en-tête d'autorisation n'est pas présent
        return res.status(403).json({ message: "Accès interdite, tokent manquante "});

}

//on decoupe la chaine en deux parties pour recuperer le token
const token_Parts = tokentHeader.split("");
if (token_Parts[0] !== 'Bearer' || token_Parts.length !== 2){
    return res.status(401).json({ message: "Accès interdit, token invalide" }); // token_list[0] devrait être "Bearer si non, accès interdit"
}
const token = token_Parts[1]; // Récupération du token jwt pur

// decoupage du token pour recuperer le payload
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//vérifie que le token est valide et qu’il a été signé avec la clé JWT_SECRET
    console.log("Decoded token:", decoded ); // Affichage du token décodé dans la console pour le débogage
    req.user = decoded; // Ajout du payload décodé à la requête pour une utilisation ultérieure
}catch (error){
    return res.status(401).json({ message: "Acces interdit, token invalide ou expire", error: error.message }); // Réponse d'erreur si le token n'est pas valide ou a expiré

}
 next(); // Appel de la fonction next() pour passer au middleware suivant
};
module.exports = auth; // Exportation du middleware d'authentification pour l'utiliser dans d'autres fichiers
