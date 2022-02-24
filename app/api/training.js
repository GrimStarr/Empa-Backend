const path = require("path");
const { Router } = require("express");
const TrainingTable = require("../training/table");
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
      trainingPost().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));

  const trainingPost = async () => {
    try {
      const {
        file,
        body: {
          category_id,
          title,
          price,
          training_language,
          capacity,
          form_id,
        },
      } = req;
      const Stitle = title.replace(/[ \/]/g, "-");
      const fileName = Date.now() + file.originalName.replace(/[ \/]/g, "-");
      const filesDir = path.join(
        __dirname,
        `../../public/img/training/${Stitle}`
      );

      const pathName = `http://13.76.216.31:5000/static/img/training/${Stitle}/${fileName}`;

      if (!fs.existsSync(filesDir)) {
        // if not create directory

        fs.mkdirSync(filesDir);
      }

      await pipeline(
        file.stream,
        fs.createWriteStream(`${filesDir}/${fileName}`)
      );

      const newTodo = await pool.query(
        "insert into training ( category_id, title, price, capacity, training_language, imgurl, form_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          category_id,
          title,
          price,
          capacity,
          training_language,
          pathName,
          form_id,
        ]
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
      trainingPut().then((resp) => res.json(resp));
    })
    .catch((error) => next(error));

  const trainingPut = async () => {
    try {
      const {
        file,
        body: {
          id,
          category_id,
          title,
          price,
          training_language,
          capacity,
          form_id,
        },
      } = req;

      if (file) {
        const Stitle = title.replace(/[ \/]/g, "-");
        const fileName = Date.now() + file.originalName.replace(/[ \/]/g, "-");
        const filesDir = path.join(
          __dirname,
          `../../public/img/training/${Stitle}`
        );

        const pathName = `http://13.76.216.31:5000/static/img/training/${Stitle}/${fileName}`;

        if (!fs.existsSync(filesDir)) {
          // if not create directory
          fs.mkdirSync(filesDir);
        }

        await pipeline(
          file.stream,
          fs.createWriteStream(`${filesDir}/${fileName}`)
        );

        const update = await pool.query(
          "UPDATE training SET category_id = $1, title = $2, price = $3, capacity = $4, training_language = $5, imgurl = $6, form_id = $7 WHERE id = $8",
          [
            category_id,
            title,
            price,
            capacity,
            training_language,
            pathName,
            form_id,
            id,
          ]
        );
        console.log("baina");
      } else {
        console.log("baihgui");
        const update = await pool.query(
          "UPDATE training SET category_id = $1, title = $2, price = $3, capacity = $4, training_language = $5, form_id = $6 WHERE id = $7",
          [category_id, title, price, capacity, training_language, form_id, id]
        );
      }

      return "success";
    } catch (err) {
      console.log(`err2`, err.message);
    }
  };
});

router.get("/", async (req, res) => {
  try {
    const allTraining = await pool.query(
      "SELECT * FROM training ORDER BY id ASC"
    );
    res.json(allTraining.rows);
  } catch (err) {
    console.log(`err3`, err.message);
  }
});

router.delete("/:id/:title", async (req, res) => {
  // const { token } = req.body;

  // authenticatedAccount({ token: token })
  //   .then(({ authenticated }) => {
  //     trainingDelete().then((resp) => res.json(resp));
  //   })
  //   .catch((error) => next(error));
  // trainingDelete = async () => {
  try {
    const { id, title } = req.params;

    const Stitle = title.replace(/[ \/]/g, "-");

    const filesDir = path.join(
      __dirname,
      `../../public/img/training/${Stitle}`
    );

    const deleteTraining = await pool.query(
      "DELETE FROM training WHERE id = $1",
      [id]
    );

    rimraf(filesDir, function () {
      res.json("success");
    });
  } catch (err) {
    console.log(`err4`, err.message);
  }
  //};
});
module.exports = router;
