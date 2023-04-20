const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const ProductManager = require('./ProductManager');
const productsRouter = require(path.resolve(__dirname,'routes', 'products.js'));
const cartsRouter = require(path.resolve(__dirname,'routes', 'carts.js'));



const products = new ProductManager(path.resolve(__dirname, 'data','products.json'));

app.use(express.json());

app.use('/products',productsRouter);
app.use('/carts',cartsRouter);

app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});