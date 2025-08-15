// Installation des packages :
// npm install cors helmet xss-clean csurf  cookie-parser


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

//CORS Configuration
const corsOptions = {
    origin: ['http://localhost:4500', 'http://localhost:4501'], // Domaines autorisés
    credentials: true, // Pour les cookies et auth
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Helmet Configuration (sécurité des headers)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false // Si vous avez des problèmes avec les images
}));

// XSS Protection
app.use(xss()); // Nettoie les données malveillantes

//Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//CSRF Protection
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'produition', // HTTPS en produition
        sameSite: 'strict'
    }
});

// Appliquer CSRF sur les routes qui en ont besoin
app.use('/', csrfProtection);

// Route pour obtenir le token CSRF
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Vos routes ici...
app.use('/produits', require('./routes/produit_route'));

// Gestion d'erreurs CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ message: 'le token crsf invalide ' });
    } else {
        next(err);
    }
});

module.exports = app;