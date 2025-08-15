const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prix: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix doit être positif"],
    },
    quantite: {
      type: Number,
      required: [true, "La quantité est obligatoire"],
      min: [0, "La quantité ne peut pas être négative"],
    },
    categorieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${process.env.UUID_ETUDIANT}_categories`,
      required: [true, "La catégorie est obligatoire"],
    },
    fournisseurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${process.env.UUID_ETUDIANT}_suppliers`,
      required: [true, "Le fournisseur est obligatoire"],
    },
    expiryDate: {
      type: Date,
      required: [true, "La date de péremption est obligatoire"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${process.env.UUID_ETUDIANT}_users`,
      required: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware : met à jour automatiquement isExpired avant chaque sauvegarde
produitSchema.pre("save", function (next) {
  this.isExpired = this.expiryDate < new Date();
  next();
});

// Middleware : met à jour isExpired avant update
produitSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.expiryDate) {
    update.isExpired = new Date(update.expiryDate) < new Date();
  }
  next();
});

module.exports = mongoose.model(
  //"Produit",
  `${process.env.UUID_ETUDIANT}_produits`,
  produitSchema,
  `${process.env.UUID_ETUDIANT}_produits`
);
