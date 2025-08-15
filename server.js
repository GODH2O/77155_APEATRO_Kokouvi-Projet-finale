const express = require("express"); // Importation du framework Express
const connectDB = require("./config/database"); // Importation de la fonction de connexion à la base de données
const dotenv = require("dotenv");// Importation de dotenv pour la gestion des variables d'environnement
dotenv.config(); // Chargement des variables d'environnement depuis le fichier .env
const userRoute = require("./routes/userRoute"); // Importation des routes utilisateur
const produit_route  = require("./routes/produit_route"); // Importation des routes produit
const orderRoute = require("./routes/orderRoute"); // Importation des routes de commande

 const app = express(); // Création de l'application Express
 const cors = require("cors"); // Importation de CORS pour la gestion des requêtes cross-origin

app.use(express.json()); // Middleware pour parser les requêtes JSON
app.use('/user', userRoute);


app.use('/produit', produit_route); // Middleware pour les routes produit
app.use('/order', orderRoute); // Middleware pour les routes de commande
//app.use('/api', require('./extras/security')); // Middleware pour la sécurité des routes

app.use(cors()); // Middleware CORS pour autoriser les requêtes cross-origin

connectDB(); // Connexion à la base de données MongoDB

const PORT = process.env.PORT || 4500 ;  //
app.listen(PORT, () => {
    console.log(`server is ruming on port ${PORT}`)// Démarrage du serveur sur le port spécifié
    
})