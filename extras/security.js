require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const app = express();

//CORS Configuration

const corsOptions = {
  origin: [
    "http://localhost:4500", // Front local
    "http://localhost:4501"
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


//Helmet Security Headers

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false
  })
);


//XSS Protection

app.use(xss());


//Rate Limiting

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Max requêtes par IP
  message: { message: "Trop de requêtes, réessayez plus tard." }
});
app.use("/api", apiLimiter);

// Body Parsing

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Routes API

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));


//Gestion globale des erreurs

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur"
  });
});

module.exports = app;
