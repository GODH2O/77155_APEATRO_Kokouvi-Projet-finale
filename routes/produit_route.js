const express =  require("express")// Importation du framework Express
const router = express.Router(); // Création d'un routeur Express
const action_Produits = require("../controllers/produitController"); // Importation du contrôleur des produits
const authRoles = require("../middleware/authRoles"); // Importation du middleware pour les rôles d'authentification
const auth = require("../middleware/auth"); // Importation du middleware d'authentification
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validate");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get("/", action_Produits.getAllProduits);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crée un produit
 *     tags: [Produits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               prix:
 *                 type: number
 *               quantity:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Produit créé
 */

router.post('/',auth,authRoles(["admin", "gerant"])  , [
    body("name").isString().trim().notEmpty(),
    body("prix").isNumeric().isFloat({ min: 0 }),
    body("quantity").isInt({ min: 0 })
  ],validateRequest,action_Produits.addProduit); // Route pour ajouter un nouveau produit
router.get('/',auth ,action_Produits.getAllProduits); // Route pour récupérer tous les produits
router.get('/user',auth , action_Produits.getAllProductsByUserId);// Route pour récupérer tous les produits par ID utilisateur
router.delete('/:id',auth ,authRoles(["admin"]) ,action_Produits.deleteProductById); // Route pour supprimer un produit par son ID
router.put('/:id',auth ,authRoles(["admin", "gerant"]) ,action_Produits.updateProductById ); // Route pour mettre à jour un
module.exports = router; // Exportation du routeur pour l'utiliser dans d'autres fichiers