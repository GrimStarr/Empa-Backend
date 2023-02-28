const { Router } = require("express");
const pool = require("../../databasePool");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const upload = multer();
const router = new Router();
const { authenticatedAccount } = require("./helper");

router.post("/:id", upload.single("file"), async (req, res, next) => {
  const { token } = req.body;

  authenticatedAccount({ token: token[0] })
    .then(({ authenticated }) => {
      assetPost().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));

  const assetPost = async () => {
    try {
      const {
        file,
        body: { title },
      } = req;
      const { id } = req.params;

      const fileName = file.originalName.replace(/[ \/]/g, "-");
      const Dir = title[0].replace(/[ \/]/g, "-");
      const filesDir = path.join(__dirname, `../../public/img/training/${Dir}`);
      if (!fs.existsSync(filesDir)) {
        // if not create directory

        fs.mkdirSync(filesDir);
      }
      await pipeline(
        file.stream,
        fs.createWriteStream(`${filesDir}/${fileName}`)
      );

      const newAsset = [];

      fs.readdirSync(filesDir).forEach((file) => {
        var src = `http://13.76.216.31:5000/static/img/training/${Dir}/${file}`;

        newAsset.push({ src: src });
      });
      // Data === null ? (Data = Object.create({})) : "";
      // // Data[`${id}assets`] = newAsset;
      // Data[`${id}assets`] = newAsset;

      return newAsset;
    } catch (err) {
      console.log(`err1`, err.message);
    }
  };
});

router.get("/", async (req, res) => {
  try {
    const newAsset = [];
    const filesDirr = path.join(__dirname, `../../public/img/asset`);
    fs.readdirSync(filesDirr).forEach((file) => {
      var src = `http://13.76.216.31:5000/static/img/asset/${file}`;

      newAsset.push({ src: src });
    });
    res.json(newAsset);
  } catch (err) {
    console.log(`err2`, err.message);
  }
});
module.exports = router;
