const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const ProductManager = require('./ProductManager');

const products = new ProductManager(path.resolve(__dirname, 'data','products.json'));

app.use(express.json());

app.get('/products', async (req, res) => {
  let limit = parseInt(req.query.limit);
  let data = await products.getProducts();
  if (limit) {
    data = data.slice(0, limit);
  }
  res.send(data);
});

app.get('/products/:pid', async (req, res) => {
  let pid = parseInt(req.params.pid);
  let data = await products.getProductById(pid);
  if (data) {
    res.send(data);
  } else {
    res.status(404).send({ error: 'Producto no encontrado' });
  }
});

app.post('/products', (req, res) => {
  let product = req.body;
  let result = products.addProduct(product.title, product.description, product.price, product.thumbnail, product.stock);
  if (result) {
    res.status(201).send(result);
  } else {
    res.status(400).send({ error: 'No se pudo crear el producto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});