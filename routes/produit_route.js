const express =  require("express")// Importation du framework Express
const router = express.Router(); // Création d'un routeur Express
const action_Produits = require("../controllers/produitController"); // Importation du contrôleur des produits
const authRoles = require("../middleware/authRoles"); // Importation du middleware pour les rôles d'authentification
const auth = require("../middleware/auth"); // Importation du middleware d'authentification

router.post('/',auth,authRoles(["admin", "gerant"]) ,action_Produits.addProduit); // Route pour ajouter un nouveau produit
router.get('/',auth ,action_Produits.getAllProduits); // Route pour récupérer tous les produits
router.get('/user', action_Produits.getAllProductsByUserId);// Route pour récupérer tous les produits par ID utilisateur
router.delete('/:id', action_Produits.deleteProductById); // Route pour supprimer un produit par son ID
router.put('/:id', action_Produits.updateProductById ); // Route pour mettre à jour un
module.exports = router; // Exportation du routeur pour l'utiliser dans d'autres fichiers