const { Router } = require("express");
const ProductsTable = require("../product/table");

const { authenticatedAccount } = require("./helper");

const router = new Router();

router.post("/", (req, res) => {
  try {
    const { description } = req.body;
    console.log(req.body);
    const newTodo = {
      hello: "hi",
    };

    res.json(newTodo);
  } catch (err) {
    console.error("err ==>", err.message);
  }
});

module.exports = router;
