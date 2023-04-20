const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const path = require('path');


const products = new ProductManager(path.resolve(__dirname, '..', 'data','products.json'));

// Obtener todos los productos
router.get('/', async (req, res) => {
  const data = await products.getProducts();
  res.json(data);
});

// Obtener un producto por id
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const data = await products.getProductById(pid);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const result = products.addProduct(title, description, code, price, status, stock, category, thumbnails);
  if (result) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: 'No se pudo crear el producto' });
  }
});

// Actualizar un producto por id
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const result = await products.updateProduct(pid, title, description, code, price, status, stock, category, thumbnails);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto por id
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const result = await products.deleteProduct(pid);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;