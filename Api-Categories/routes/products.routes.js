const productsRoutes = require('express').Router();
const products = require('../controllers/products.controller');
const { validarToken } = require('../middlewares/auth');

productsRoutes.get("/all", validarToken, products.findAll);

productsRoutes.get("/show/:id", validarToken, products.findOne);

productsRoutes.get("/all/pages/:page", validarToken, products.findAllPages);

productsRoutes.post("/create", validarToken, products.create);

productsRoutes.put("/update", products.update);

productsRoutes.delete("/delete/:id", validarToken, products.delete);

module.exports = productsRoutes;