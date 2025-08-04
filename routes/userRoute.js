const express =  require("express")// Importation du framework Express
const router = express.Router(); // Création d'un routeur Express
const { registerUser } = require("../controllers/userController"); // Importation du contrôleur utilisateur


router.post("/registerUser", registerUser); // Route pour l'enregistrement d'un nouvel utilisateur

module.exports = router; // Exportation du routeur pour l'utiliser dans d'autres fichiers 