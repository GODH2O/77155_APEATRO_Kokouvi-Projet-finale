const express = require("express");
const router = express.Router();
const { createOrder, getOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const auth = require("../middleware/auth");
const authRoles = require("../middleware/authRoles");

// Client crée une commande
router.post("/", auth, authRoles(["client"]), createOrder);

// Voir toutes les commandes
router.get("/", auth, authRoles(["admin", "gerant", "livreur"]), getOrders);

// Mettre à jour commande (gérant, admin, livreur)
router.put("/:id", auth, authRoles(["admin", "gerant", "livreur"]), updateOrder);

// Supprimer commande (admin uniquement)
router.delete("/:id", auth, authRoles(["admin"]), deleteOrder);

module.exports = router;
