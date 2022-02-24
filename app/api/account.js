const { Router } = require("express");
const AccountTable = require("../account/table");
const { hash } = require("../account/helper");
const { setToken, deleteToken, authenticatedAccount } = require("./helper");

const router = new Router();

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  // const usernameHash = hash(username);
  const passwordHash = hash(password);

  AccountTable.getAccount({ username })
    .then(({ account }) => {
      if (!account) {
        return AccountTable.storeAccount({ username, passwordHash });
      } else {
        const error = new Error("This username is already been taken");
        error.statusCode = 409;
        console.log(error.message);
        throw error;
      }
    })
    .then(() => {
      return setToken({ username, passwordHash, res });
    })
    .then(({ message }) => res.json({ message }))
    .catch((error) => next(error));
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  AccountTable.getAccount({ username })
    .then(({ account }) => {
      if (account && account.passwordHash === hash(password)) {
        const { id, username, passwordHash } = account;

        return setToken({ id, username, passwordHash, res });
      } else {
        const error = new Error("Incorrect username/password");
        error.statusCode = 409;
        console.log(error.message);
        throw error;
      }
    })
    .then(({ message }) => res.json({ message }))
    .catch((error) => next(error));
});

router.get("/logout", (req, res, next) => {
  deleteToken({ res });
});

router.get("/authenticated", (req, res, next) => {
  authenticatedAccount(req.body.token)
    .then(({ authenticated }) => res.json({ authenticated }))
    .catch((error) => next(error));
});

module.exports = router;
