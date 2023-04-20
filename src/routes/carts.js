const path = require("path");
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

const FILE_PATH = path.resolve(__dirname, '..', 'data','carts.json');

router.post("/", (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: [],
  };
  fs.writeFile(FILE_PATH, JSON.stringify(newCart), (error) => {
    if (error) {
      res.status(500).json({ error: "Error al crear el carrito" });
    } else {
      res.json(newCart);
    }
  });
});

router.get("/:cid", (req, res) => {
  fs.readFile(FILE_PATH, (error, data) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener el carrito" });
    } else {
      const cart = JSON.parse(data);
      const cartId = req.params.cid;
      if (cart.id === cartId) {
        res.json(cart.products);
      } else {
        res.status(404).json({ error: "Carrito no encontrado" });
      }
    }
  });
});

router.post("/:cid/product/:pid", (req, res) => {
  const productId = req.params.pid;
  const productQuantity = 1;
  fs.readFile(FILE_PATH, (error, data) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener el carrito" });
    } else {
      const cart = JSON.parse(data);
      const cartId = req.params.cid;
      if (cart.id === cartId) {
        const existingProductIndex = cart.products.findIndex(
          (product) => product.id === productId
        );
        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += productQuantity;
        } else {
          cart.products.push({
            id: productId,
            quantity: productQuantity,
          });
        }
        fs.writeFile(FILE_PATH, JSON.stringify(cart), (error) => {
          if (error) {
            res.status(500).json({ error: "Error al agregar el producto" });
          } else {
            res.json(cart);
          }
        });
      } else {
        res.status(404).json({ error: "Carrito no encontrado" });
      }
    }
  });
});

module.exports = router;