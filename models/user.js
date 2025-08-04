const mongoose = require("mongoose");

// Schéma utilisateur pour l'épicerie en ligne
const userSchema = new mongoose.Schema({
  email: {
    type: String,// Type de données pour l'email
    required: true,// Champ obligatoire
    unique: true,// Doit être unique dans la collection
    lowercase: true,// Convertit l'email en minuscules
    trim: true,// Supprime les espaces autour de l'email
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Veuillez entrer une adresse email valide',
    ],// Expression régulière pour valider l'email
  },

  password: {
    type: String,// Type de données pour le mot de passe
    required: true,// Champ obligatoire
    minlength: [6, 'Password must be at least 6 characters long'],// Longueur minimale du mot de passe
    maxlength: [200, 'Password must be less than 20 characters long']// Longueur maximale du mot de passe
  },

  nom: { 
    type: String,// Type de données pour le nom
    required: true,// Champ obligatoire
    trim: true // Supprime les espaces autour du nom
},
  prenom: { 
    type: String,// Type de données pour le prénom
    required: true,// Champ obligatoire
    trim: true// Supprime les espaces autour du prénom
 },


 
  role: {
    type: String,
    enum: ['client', 'gerant', 'livreur', 'admin'],
    default: 'client',
  },

  zone: {
    type: String,
    required: function () {
      return this.role === 'livreur'; // obligatoire uniquement pour livreur
    },
  },

//   refreshToken: {
//     type: String,
//     default: null,
//   },

  isActive: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
});
//
userSchema.methods.setActive = function() {// Méthode pour activer l'utilisateur
    this.isActive = true;
    return this.save();
};

userSchema.methods.getActive = function() {// Méthode pour vérifier si l'utilisateur est actif
    return this.isActive;
};


// Export du modèle avec nom de collection dynamique
module.exports = mongoose.model(
  'User',
  userSchema,
  `${process.env.UUID_ETUDIANT}_users`
);
