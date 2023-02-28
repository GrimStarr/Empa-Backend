const { Router } = require("express");
const ProductsTable = require("../product/table");

const { authenticatedAccount } = require("./helper");

const router = new Router();

router.post("/new", (req, res, next) => {
  const { product, token } = req.body;

  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      console.log("woow");
      // return ProductsTable.addProduct(product)
    })
    .then(() => res.json({ message: "success" }))
    .catch((error) => next(error));
});

router.post("/remove/:id", (req, res, next) => {
  const id = req.param.id;
  const { token } = req.body;

  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      return ProductsTable.removeProduct(id);
    })
    .then(() => res.json({ message: "success" }))
    .catch((error) => next(error));
});

router.post("/update/:id", (req, res, next) => {
  const id = req.param.id;
  const { token, product } = req.body;

  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      return ProductsTable.updateProduct(id, product);
    })
    .then(() => res.json({ message: "success" }))
    .catch((error) => next(error));
});

router.get("/", (req, res, next) => {
  ProductsTable.getAllProducts()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
