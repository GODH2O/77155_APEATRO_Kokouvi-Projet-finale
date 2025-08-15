const mongoose = require("mongoose");
const User = require("./user");
const Produit = require("./produit");
require("dotenv").config();

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${process.env.UUID_ETUDIANT}_users`,
      required: true,
    },
    items: [
      {
        produitId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: `${process.env.UUID_ETUDIANT}_produits`,
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "preparing", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    zone: {
      type: String,
      required: true,
    },
    livreurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${process.env.UUID_ETUDIANT}_users`,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(//"Order"
  `${process.env.UUID_ETUDIANT}_orders`,orderSchema,`${process.env.UUID_ETUDIANT}_orders`
);
