const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Épicerie en ligne API",
      version: "1.0.0",
      description: "Documentation API pour le projet final",
    },
    servers: [
      {
        url: "http://localhost:4500/api",
      },
    ],
  },
  apis: ["./routes/*.js"], // 📌 Chemin vers tes fichiers de routes
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📄 Swagger Docs disponible sur http://localhost:${process.env.PORT}/api-docs`);
}

module.exports = swaggerDocs;
