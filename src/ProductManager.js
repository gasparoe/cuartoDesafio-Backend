const fs = require("fs");

const uuid4 = require("uuid4");

//Creo la clase ProductManager

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail = []
  ) {
    if (
      title != undefined &&
      description != undefined &&
      code != undefined &&
      price != undefined &&
      stock != undefined &&
      category != undefined
    ) {

      let product = {
        title: title,
        description: description,
        code: code,
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnail: thumbnail,
        id: uuid4(), //Asigno un uuid como ID de producto
      };

      try {
        const data = await fs.promises.readFile(this.path, "utf-8");
        let products = [];
        if (data.length > 1) {
          products = JSON.parse(data);
        }
        this.products = products;

        if (this.products.find((producto) => producto.code === product.code)) {
          return "Ya existe un producto con ese codigo";
        } else {
          this.products.push(product);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.products),
            "utf-8"
          );
          return "El archivo se guardo correctamente";
        }
      } catch (err) {
        return `Error ${err}`;
      }
    } else {
      return "No se puede crear el producto. Faltan definir caracteristicas";
    }
  }


  //GET PRODUCTS
  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      let products = [];
      if (data.length > 1) {
        products = JSON.parse(data);
      }
      this.products = products;
      return this.products;
    } catch (err) {
      console.error(`ERROR ${err}`);
      this.products = [];
      return this.products;
    }
  }


  //GET PRODUCTS BY ID
  async getProductById(id) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      let products = [];
      if (data.length > 1) {
        products = JSON.parse(data);
      }
      this.products = products;

      let product = this.products.find((producto) => producto.id === id);
      if (product) {
        console.log(`Se ha encontrado el producto con ID ${id}.`);
        return product;
      } else {
        console.error("Not found");
        return;
      }
    } catch (err) {
      return `ERROR ${err}`;
    }
  }

  //UPDATE PRODUCT
  async updateProduct(id, nuevoProducto) {
    try {
      let isUpdated = false;
      const data = await fs.promises.readFile(this.path, "utf-8");
      let products = [];
      if (data.length > 1) {
        products = JSON.parse(data);
      }
      this.products = products;

      this.products.forEach((producto, index) => {
        if (producto.id === id) {
          if (nuevoProducto.title != undefined) {
            producto.title = nuevoProducto.title;
          }

          if (nuevoProducto.description != undefined) {
            producto.description = nuevoProducto.description;
          }

          if (nuevoProducto.code != undefined) {
            producto.code = nuevoProducto.code;
          }

          if (nuevoProducto.price != undefined) {
            producto.price = nuevoProducto.price;
          }

          if (nuevoProducto.status != undefined) {
            producto.status = nuevoProducto.status;
          }

          if (nuevoProducto.stock != undefined) {
            producto.stock = nuevoProducto.stock;
          }

          if (nuevoProducto.category != undefined) {
            producto.category = nuevoProducto.category;
          }

          if (nuevoProducto.thumbnail != undefined) {
            producto.thumbnail = nuevoProducto.thumbnail;
          }

          //ANTES DE ACTUALIZAR EL PRODUCTO, VERIFICO QUE EL NUEVO CODIGO DEL PRODUCTO ACTUALIZADO NO EXISTA
          if (
            this.products.find(
              (product) =>
                product.code === producto.code && product.id !== producto.id
            )
          ) {
            return "Ya existe un producto con ese codigo"
            //return "Ya existe un producto con ese codigo";
          } else {
            this.products[index] = producto;
            isUpdated = true;
          }
        }
      });
      if (isUpdated) {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products),
          "utf-8"
        );
        return "Se ha actualizado el producto correctamente";
      } else {
        return "No se ha podido actualizar el producto"
        //return "No se ha podido actualizar el producto";
      }
    } catch (err) {
      return `${err}`;
    }
  }

  //DELETE PRODUCT
  async deleteProduct(id) {
    try {
      let isDeleted = false;
      const data = await fs.promises.readFile(this.path, "utf-8");
      let products = [];
      if (data.length > 1) {
        products = JSON.parse(data);
      }
      this.products = products;

      this.products.forEach((producto, index) => {
        if (producto.id === id) {
          this.products.splice(index, 1);
          isDeleted = true;
        }
      });

      if (isDeleted) {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products),
          "utf-8"
        );
        return "Se elimino el producto correctamente";
      } else {
        return "No se ha encontrado el producto a eliminar"
        //return "No se ha encontrado el producto a eliminar";
      }
    } catch {
      return `Error ${err}`;
    }
  }
}
module.exports = ProductManager;
