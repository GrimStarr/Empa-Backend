const path = require("path");
const { Router } = require("express");
const pool = require("../../databasePool");
const multer = require("multer");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const upload = multer();
const { authenticatedAccount } = require("./helper");
const rimraf = require("rimraf");

const router = new Router();
router.post("/", upload.single("file"), async (req, res, next) => {
  const { token } = req.body;
  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      newsPost().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));
  const newsPost = async () => {
    try {
      const {
        file,
        body: { title, brief, body, type, date },
      } = req;
      const news = await pool.query(
        "insert into news ( title, brief, type, date) VALUES ($1, $2, $3, $4) RETURNING id",
        [title, brief, type, date]
      );

      const newsID = "n" + news.rows[0].id;
      const fileName = Date.now() + file.originalName.replace(/[ \/]/g, "-");
      const filesDir = path.join(__dirname, `../../public/img/news/${newsID}`);

      const pathName = `http://13.76.216.31:5000/static/img/news/${newsID}/${fileName}`;

      if (!fs.existsSync(filesDir)) {
        // if not create directory

        fs.mkdirSync(filesDir);
      }

      await pipeline(
        file.stream,
        fs.createWriteStream(`${filesDir}/${fileName}`)
      );

      const dbimg = await pool.query(
        "update news set imgurl = $1 where id = $2 ",
        [pathName, news.rows[0].id]
      );

      return "success";
    } catch (err) {
      console.log(`err1`, err.message);
    }
  };
});

router.put("/", upload.single("file"), async (req, res, next) => {
  const { token } = req.body;
  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      newsPut().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));

  newsPut = async () => {
    try {
      const {
        file,
        body: { id, title, brief, type, date },
      } = req;
      const newsID = "n" + id;
      const fileName = Date.now() + file.originalName.replace(/[ \/]/g, "-");
      const filesDir = path.join(__dirname, `../../public/img/news/${newsID}`);

      const pathName = `http://13.76.216.31:5000/static/img/news/${newsID}/${fileName}`;

      if (!fs.existsSync(filesDir)) {
        // if not create directory
        fs.mkdirSync(filesDir);
      }

      await pipeline(
        file.stream,
        fs.createWriteStream(`${filesDir}/${fileName}`)
      );

      const update = await pool.query(
        "UPDATE news SET title = $1, imgurl = $2, brief = $3, type = $4, date = $5) WHERE id = $6",
        [title, pathName, brief, type, date, id]
      );
      return "success";
    } catch (err) {
      console.log(`err2`, err.message);
    }
  };
});

router.get("/", async (req, res) => {
  try {
    const allTraining = await pool.query("SELECT * FROM news ORDER BY id ASC");
    res.json(allTraining.rows);
  } catch (err) {
    console.log(`err3`, err.message);
  }
});

router.delete("/:id", async (req, res) => {
  //console.log("fucker",req.body);
  // const { token } = req.body;
  // console.log(token);
  //  authenticatedAccount({ token: token })
  //    .then(({ authenticated }) => {
  //      newsDelete().then((resp) => res.json(resp));
  //    })
  //   .catch((error) => next(error));

  //  newsDelete = async () => {
  try {
    //  const { title } = req.body;
    const token = req.body;
    const { id } = req.params;
    const newsID = "n" + id;

    const filesDir = path.join(__dirname, `../../public/img/news/${newsID}`);

    const deleteNews = await pool.query("DELETE FROM news WHERE id = $1", [id]);

    rimraf(filesDir, function () {
      res.json("success");
    });
    // fs.rmdir(filesDir, (err) => {
    //   if (err) {
    //     return console.log("error occurred in deleting directory", err);
    //   }
    //   console.log("dooone");
    //   return "success";
    // });
  } catch (err) {
    console.log(`err4`, err.message);
  }
  // };
});
module.exports = router;
