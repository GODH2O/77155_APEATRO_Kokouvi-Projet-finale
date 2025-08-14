const express =  require("express")// Importation du framework Express
const router = express.Router(); // Création d'un routeur Express
const { registerUser, loginUser, getAllUsers, updateUser, deleteUser, refreshAccessToken} = require("../controllers/userController"); // Importation du contrôleur utilisateur
const auth = require("../middleware/auth"); // Importation du middleware d'authentification


router.post("/registerUser", registerUser); // Route pour l'enregistrement d'un nouvel utilisateur
router.post("/loginUser", loginUser); // Route pour la connexion d'un utilisateur
router.get("/getAllUsers", getAllUsers); // Route pour récupérer tous les utilisateurs
router.put("/updateUser/:id", updateUser); // Route pour mettre à jour un utilisateur par son ID
router.delete("/deleteUser/:id", auth, deleteUser); // Route pour supprimer un utilisateur par son ID
router.post("/refreshUserToken", auth, refreshAccessToken); // Route pour rafraîchir le token d'un utilisateur, nécessite une authentification

module.exports = router; // Exportation du routeur pour l'utiliser dans d'autres fichiers 