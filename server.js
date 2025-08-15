const express = require("express"); // Importation du framework Express
const connectDB = require("./config/database"); // Importation de la fonction de connexion à la base de données
const dotenv = require("dotenv");// Importation de dotenv pour la gestion des variables d'environnement
dotenv.config(); // Chargement des variables d'environnement depuis le fichier .env
const userRoute = require("./routes/userRoute"); // Importation des routes utilisateur
const produit_route  = require("./routes/produit_route"); // Importation des routes produit

 const app = express(); // Création de l'application Express
 const cors = require("cors"); // Importation de CORS pour la gestion des requêtes cross-origin

app.use(express.json()); // Middleware pour parser les requêtes JSON
app.use('/user', userRoute);


app.use('/produit', produit_route); // Middleware pour les routes produit

connectDB(); // Connexion à la base de données MongoDB

const PORT = process.env.PORT || 4500 ;  //
app.listen(PORT, () => {
    console.log(`server is ruming on port ${PORT}`)// Démarrage du serveur sur le port spécifié
    
})