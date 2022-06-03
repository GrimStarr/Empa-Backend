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
const url = require("url");

router.post("/", upload.single("file"), async (req, res, next) => {
  const { token } = req.body;
  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      bannerPost().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));

  const bannerPost = async () => {
    try {
      const {
        file,
        body: { title, body, link, page, color },
      } = req;

      const fileName = Date.now() + file.originalName;

      const filesDir = path.join(__dirname, `../../public/img/banner/${page}`);
      if (!fs.existsSync(filesDir)) {
        // if not create directory

        fs.mkdirSync(filesDir);
      }
      await pipeline(
        file.stream,
        fs.createWriteStream(`${filesDir}/${fileName}`)
      );
      const pathName = `http://13.76.216.31:5000/static/img/banner/${page}/${fileName}`;
      const banner = await pool.query(
        "insert into banner (title, body, imgurl, link, page, color) VALUES ($1, $2, $3, $4, $5, $6)",
        [title, body, pathName, link, page, color]
      );
      return "success";
    } catch (err) {
      console.log(`err1`, err.message);
    }
  };
});

router.get("/", async (req, res) => {
  const { page } = req.params;
  try {
    const banner = await pool.query("SELECT * FROM banner ORDER BY id ASC");
    res.json(banner.rows);
  } catch (err) {
    console.log(`err2`, err.message);
  }
});
router.post("/delete/:id", async (req, res, next) => {
  const { token } = req.body;
  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      bannerDelete().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));
  const bannerDelete = async () => {
    try {
      const { id } = req.params;
      const bannerName = await pool.query(
        "select imgurl from banner where id = $1",
        [id]
      );

      const pathname = url
        .parse(bannerName.rows[0].imgurl)
        .pathname.replace("static", "public");

      const filesDir = path.join(__dirname, `../../${pathname}`);
      const deleteBanner = await pool.query(
        "DELETE FROM banner WHERE id = $1",
        [id]
      );
      fs.unlink(filesDir, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        return "success";
      });
    } catch (err) {
      console.log(`err4`, err.message);
    }
  };
});
module.exports = router;
