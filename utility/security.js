const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); // Charge les variables d'environnement

// Génère un access token valable 14 minutes
const generateToken = (user, role, isActive) => {
    const payload = {
        id: user._id,
        role: role,
        isActive: isActive,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '14min' });
};

// Génère un refresh token valable 1 jour
const refreshToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
};

// Middleware pour vérifier un access token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token invalide" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré" });
    }
};

// Middleware pour vérifier un refresh token
const verifyRefreshToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Refresh token manquant" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Refresh token invalide" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Refresh token invalide ou expiré" });
    }
};

module.exports = { generateToken, refreshToken, verifyToken, verifyRefreshToken };



// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config(); // Chargement des variables d'environnement depuis le fichier .env

// const generateToken = (user, role, isActive) => {
//     const payload = {
//         id: user._id,
//         role: role,
//         isActive: isActive,
//     };
//     return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:'14min'} ); // Génération du token JWT avec une durée de validité de 1 heure

// };
// //genere un refresh token 
// const refreshToken = (user) => {
//     const paylood = {
//         id: user._id,
//         role: user.role,
        
//     }
//     return jwt.sign(paylood, process.env.JWT_REFRESH_SECRET , { expiresIn: '1d'}); // cree un refresh token de rafraîchissement avec une durée de validité de 1 jour
// };
// // middleware pour vérifier le token
// const verifyToken = (req, res, next) => {
//     const aut
//     //const token = req.headers.authorization;
//     if (!token){
//         return res.status(401).json({ message: "Token manquant" }); // Réponse d'erreur si le token est manquant
//     }
//     next()
// };

// //
// const verifyRefreshToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).json({ message: "Token de rafraîchissement manquant" }); // Réponse d'erreur si le token de rafraîchissement est manquant
//     }

//     const token = authHeader.split('')[1];// Extraction du token de rafraîchissement depuis l'en-tête Authorization
//     if (!token) {
//         return res.status(401).json({ message: "Token de rafraîchissement invalide" }); // Réponse d'erreur si le token de rafraîchissement est invalide
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET); // Vérification du token de rafraîchissement
//         req.user = decoded.user; // Ajout des informations de l'utilisateur décodées à la requête
//         next();// Appel de la fonction suivante dans la chaîne de middleware
//     } catch (error) {
//         return res.status(403).json({ message: "Token de rafraîchissement invalide" }); // Réponse d'erreur si le token de rafraîchissement est invalide
//     }
// };


// module.exports = { generateToken, refreshToken, verifyToken, verifyRefreshToken }; // Exportation des fonctions pour les utiliser dans d'autres fichiers

