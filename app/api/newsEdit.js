const { Router } = require("express");
const pool = require("../../databasePool");
const path = require("path");
const fs = require("fs");
const { join } = require("path");
const { authenticatedAccount } = require("./helper");
const router = new Router();
router.post("/:id/content", async (req, res) => {
  const { token } = req.body;
  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      newsEditPost().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));
  const newsEditPost = async () => {
    try {
      const { id } = req.params;
      var data = req.body;
      delete data["token"];

      const pageData = await pool.query(
        "UPDATE news SET body = $1 WHERE id = $2",
        [data, id]
      );
      return pageData;
    } catch (err) {
      console.log(`err`, err.message);
    }
  };
});
router.get("/:id/content", async (req, res) => {
  try {
    const { id } = req.params;
    const pageData = await pool.query("SELECT * FROM news WHERE id = $1", [id]); //  const pageContent = await ( req.body) => ;

    res.header("Content-Type", "application/json");

    var Data = pageData.rows[0].body;
    const newAsset = [];
    const newsID = "n" + id;
    const filesDir = path.join(__dirname, `../../public/img/news/${newsID}/`);
    if (!fs.existsSync(filesDir)) {
      // if not create directory

      fs.mkdirSync(filesDir);
    }

    fs.readdirSync(filesDir).forEach((file) => {
      var src = `http://13.76.216.31:5000/static/img/news/${newsID}/${file}`;

      newAsset.push({ src: src });
    });
    Data === null ? (Data = Object.create({})) : "";
    // Data[`${id}assets`] = newAsset;
    Data[`${id}assets`] = newAsset;

    res.json(Data);
  } catch (err) {
    console.log(`err`, err.message);
  }
});
module.exports = router;
