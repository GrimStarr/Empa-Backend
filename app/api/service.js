const { Router } = require("express");
const ServiceTable = require("../service/table");

const { authenticatedAccount } = require("./helper");

const router = new Router();

router.post("/new", (req, res, next) => {
  const { service, token } = req.body;

  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      return ServiceTable.addService(service);
    })
    .then(() => res.json({ message: "success" }))
    .catch((error) => next(error));
});

router.post("/remove/:id", (req, res, next) => {
  const id = req.param.id;
  const { token } = req.body;

  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      return ServiceTable.removeService(id);
    })
    .then(() => res.json({ message: "success" }))
    .catch((error) => next(error));
});

router.post("/update/:id", (req, res, next) => {
  const id = req.param.id;
  const { token, service } = req.body;

  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      return ServiceTable.updateService(id, service);
    })
    .then(() => res.json({ message: "success" }))
    .catch((error) => next(error));
});

router.get("/", (req, res, next) => {
  ServiceTable.getAllServices()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
