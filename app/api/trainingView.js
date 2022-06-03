const { Router } = require("express");
const TrainingTable = require("../training/table");
const pool = require("../../databasePool");
const path = require("path");
const fs = require("fs");
const { join } = require("path");
const { json } = require("body-parser");
const { authenticatedAccount } = require("./helper");

const router = new Router();

router.get("/:id/content", async (req, res) => {
  try {
    const { id } = req.params;
    const pageData = await pool.query("SELECT * FROM training WHERE id = $1", [
      id,
    ]); //  const pageContent = await ( req.body) => ;

    // res.header("Content-Type", "application/json");

    var Data = pageData.rows[0].body;
    const newAsset = [];
    const Dir = pageData.rows[0].title.replace(/[ \/]/g, "-");
    const filesDir = path.join(__dirname, `../../public/img/training/${Dir}/`);
    if (!fs.existsSync(filesDir)) {
      // if not create directory

      fs.mkdirSync(filesDir);
    }

    fs.readdirSync(filesDir).forEach((file) => {
      var src = `http://13.76.216.31:5000/static/img/training/${Dir}/${file}`;

      newAsset.push({ src: src });
    });
    Data === null ? (Data = Object.create({})) : "";
    // Data[`${id}assets`] = newAsset;
    Data[`${id}assets`] = newAsset;

    res.render("news", {
      data: Data,
      id: id,
      content: pageData.rows[0],
    });
  } catch (err) {
    console.log(`err`, err.message);
  }
});
module.exports = router;
