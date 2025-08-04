const mongoose = require("mongoose");// Importation de mongoose
const dotenv = require("dotenv");// Importation de dotenv pour la gestion des variables d'environnement
dotenv.config();
const dbURI = process.env.DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);// Connexion à la base de données MongoDB
        console.log("Database connected OK!");
    }catch (error) {
        console.error("Database connected failed:", error);
        process.exit(1);//arrêt du processus en cas d'erreur
    }
}
module.exports =  connectDB