const fs = require('fs');

class ProductManager {
  #products;
  #path;

  constructor(path) {
    this.#products = [];
    this.#path = path;

    try {
      const data = fs.readFileSync(this.#path);
      this.#products = JSON.parse(data);
    } catch (error) {
      console.error(`Error leyendo el archivo ${this.#path}: ${error}`);
    }
  }

  #generateCode = () => {
    let code;
    if (this.#products.length === 0) {
      code = 1;
    } else {
      code = this.#products[this.#products.length - 1].code + 1;
    }
    return code;
  };

  #requireData = (title, description, price, thumbnail, stock) => {
    if (!title || !description || !price || !thumbnail || !stock) {
      console.log('Por favor ingrese los valores de todos los campos');
      return false;
    }
    return true;
  };

  saveProducts() {
    try {
      const data = JSON.stringify(this.#products, null, 4);
      fs.writeFileSync(this.#path, data);
    } catch (error) {
      console.error(`Error guardando el producto en ${this.#path}: ${error}`);
    }
  }

  addProduct(title, description, price, thumbnail, stock) {
    if (!this.#requireData(title, description, price, thumbnail, stock)) {
      return;
    }

    let code = this.#generateCode();

    let newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.#products.push(newProduct);

    this.saveProducts();
  }

  getProducts = async () => {
    return this.#products;
  };

  getProductById = (code) => {
    let product = this.#products.find((elem) => elem.code == code);
    if (product) {
      return product;
    } else {
      let error = 'Not found';
      return error;
    }
  };

  updateProduct(id, data) {
    const index = this.#products.findIndex((p) => p.code === id);
    if (index !== -1) {
      const product = { ...this.#products[index], ...data, id };
      this.#products.splice(index, 1, product);
      this.saveProducts();
      return product;
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.#products.findIndex((p) => p.code === id);
    if (index !== -1) {
      this.#products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }
}

module.exports = ProductManager;