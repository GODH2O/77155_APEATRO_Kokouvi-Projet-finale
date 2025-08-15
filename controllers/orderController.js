const Order = require("../models/order");
const User = require("../models/user");
const Produit = require("../models/produit");

//Créer une commande
exports.createOrder = async (req, res) => {
  try {
    const { items, zone } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Aucun produit dans la commande" });
    }

    // Calcul du total
    let total = 0;
    items.forEach(item => {
      if (!item.price) {
        throw new Error("Chaque produit doit avoir un prix");
      }
      total += item.price * item.quantity;
    });

    const order = new Order({
      clientId: req.user.id,
      items,
      total,
      zone,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Récupérer toutes les commandes avec pagination/tri/filtres
exports.getOrders = async (req, res) => {
  try {
    const { status, zone, clientId, sort, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (zone) filter.zone = zone;
    if (clientId) filter.clientId = clientId;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort(sort ? sort.split(",").join(" ") : "-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .populate("clientId")
      .populate("items.produitId")
      .populate("livreurId");

    const total = await Order.countDocuments(filter);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une commande
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une commande
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });
    res.json({ message: "Commande supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
