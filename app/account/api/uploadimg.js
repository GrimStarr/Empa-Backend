const { Router } = require("express");
const pool = require("../../databasePool");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = new Router();

const filesDir = "backend/../../public/img/training/NEW";

router.post("/", async (req, res, next) => {
  const body = req.body.body;

  try {
    if (!fs.existsSync(filesDir)) {
      // if not create directory
      fs.mkdirSync(filesDir);
    }

    var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, filesDir);
      },
      filename: (req, file, cb) => {
        console.log("okey?", file);
        cb(null, Date.now() + file.originalname);
      },
    });
    var upload = multer({ storage: storage }).single("image");
    upload(req, res, next);
    console.log("heyhey", upload);
    res.json({ worked: "hehe" });
    next();
  } catch (err) {
    console.log(`err`, err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM training ORDER BY id ASC");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(`err`, err.message);
  }
});
module.exports = router;
