const Produit = require('../models/produit');// Importation du modèle de produits
const User  = require('../models/user'); // Importation du modèle utilisateur
const auth = require('../middleware/auth'); // Importation du middleware d'authentification
const jwt = require('jsonwebtoken'); // Importation de la bibliothèque JWT pour la gestion des tokens


// ajouter un nouveau produits

const addProduit = async (req, res) => {
    try {
        const data = req.body; // recuperation des modeles envoyer 
        const produit = await Produit.create(data);//insère un nouveau document dans la base avec les valeurs de data
        res.status(201).json(produit); // Réponse de succès avec le produit créé

    } catch (error) {
        res.status(500).json({message : error.message});

}
// Client → envoie données produit → (req.body)
// Serveur → Product.create(data) → DB enregistre produit
// Serveur → renvoie 201 + produit créé

};

// listes des produits
const getAllProduits = async (req, res) => {
    try {
        //Récupération des paramètres de requête avec valeurs par défaut
        let {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc",
            search = "",
            category,
            prixMin,
            prixMax,
            dateMin,
            dateMax
        } = req.query;

        // Conversion des valeurs
        page = parseInt(page);
        limit = parseInt(limit);

        //Construction des filtres
        const filters = {};

        // 🔍 Recherche par nom
        if (search) {
            filters.nom = { $regex: search, $options: "i" };
        }

        //Filtre par catégorie
        if (category) {
            filters.categorie = category;
        }

        //Filtre par plage de prix
        if (prixMin || prixMax) {
            filters.prix = {};
            if (prixMin) filters.prix.$gte = parseFloat(prixMin);
            if (prixMax) filters.prix.$lte = parseFloat(prixMax);
        }

        //Filtre par date de création
        if (dateMin || dateMax) {
            filters.createdAt = {};
            if (dateMin) filters.createdAt.$gte = new Date(dateMin);
            if (dateMax) filters.createdAt.$lte = new Date(dateMax);
        }

        //Tri
        const sortOrder = order === "asc" ? 1 : -1;
        const sortCriteria = { [sortBy]: sortOrder };

        //Récupération des produits
        const produits = await Produit.find(filters)
            .sort(sortCriteria)
            .skip((page - 1) * limit)
            .limit(limit);

        //Nombre total pour pagination
        const total = await Produit.countDocuments(filters);

        //Réponse
        return res.status(200).json({
            page,
            limit,
            totalProduits: total,
            totalPages: Math.ceil(total / limit),
            sortBy,
            order,
            filtersApplied: filters,
            produits
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erreur lors de la récupération des produits",
            error: error.message
        });
    }
};

// const getAllProduits = async (req, res) => {
//     try {
//         const produits = await Produit.find().sort({ createdAt: -1});
//         return res.status(200).json(produits); // Réponse de succès avec la liste des produits

//     } catch (error) {
//         return res.status(500).json({ message: "Erreur lors de la récupération des produits", error: error.message }); // Réponse d'erreur en cas d'erreur lors de la récupération
//     }

//     Client → GET /products
// Serveur → Product.find() + sort
// Serveur → 200 OK + liste triée
// Ou erreur → 500 + message



// prendre tous les produits via user_id
const getAllProductsByUserId = async (req, res) => {
    const user_id = req.query.userId;
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required in the query' });
    }

    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
        return res.status(403).json({ message: 'Token is required' });
    }

    const token_list = tokenHeader.split(' ');
    if (token_list[0] !== 'Bearer') {
        return res.status(403).json({ message: 'Token should be Bearer' });
    }

    const token = token_list[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id !== user_id) {
            return res.status(403).json({ message: 'user a un id qui ne correspond pas ' });
        }
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token', error: error.message });
    }

    try {
        const produits = await Produit.find({ userId: user_id }).sort({ createdAt: -1 });
        return res.status(200).json(produits);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
//mise à jour d'un produit par son ID
const updateProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const produit = await Produit.findByIdAndUpdate(id, data, {new: true});
        if (!produit) {
            return res.status(404).json({message: 'Produit non trouvé'});
        }
        res.status(200).json(produit);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
// suppression d'un produit par son ID
const deleteProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const produit = await Produit.findByIdAndDelete(id);
        if (!produit) {
            return res.status(404).json({message: 'produit non trouvé'});
        }
        res.status(200).json({message: 'poduit supprimé avec succès'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
// Insertion de plusieurs produits
const insertManyProducts = async (req, res) => {
    try {
        const data = req.body;
        const produits = await ProduIt.insertMany(data, {ordered: false, upsert: true});
        res.status(201).json(produits);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    addProduit,
    getAllProduits,
    getAllProductsByUserId,
    updateProductById,
    deleteProductById,
    insertManyProducts
};