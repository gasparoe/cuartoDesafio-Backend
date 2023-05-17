const express = require("express");
const productManager = require("../src/ProductManager");
const { Router } = express;

const router = new Router();

router.get("/", (req, res) => {
  const instanciaProductManager = new productManager("./products.json");
  instanciaProductManager
    .getProducts()
    .then((products) => {
      let data = {
        productos: products,
      };
      res.render("realTimeProducts");
    })
    .catch((err) => res.status(500).send({ error: "server error" }));
});

module.exports = router;
