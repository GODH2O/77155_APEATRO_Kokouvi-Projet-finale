// Installation des packages :
// npm install cors helmet xss-clean csurf  cookie-parser


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

// 1. CORS Configuration
const corsOptions = {
    origin: ['http://localhost:4500', 'http://localhost:4501'], // Domaines autorisés
    credentials: true, // Pour les cookies et auth
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. Helmet Configuration (sécurité des headers)
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

// 3. XSS Protection
app.use(xss()); // Nettoie les données malveillantes

// 4. Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. CSRF Protection
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        sameSite: 'strict'
    }
});

// Appliquer CSRF sur les routes qui en ont besoin
app.use('/api', csrfProtection);

// Route pour obtenir le token CSRF
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Vos routes ici...
app.use('/api/products', require('./routes/productRoutes'));

// Gestion d'erreurs CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ message: 'Invalid CSRF token' });
    } else {
        next(err);
    }
});

module.exports = app;