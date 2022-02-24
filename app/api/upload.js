const { Router } = require("express");
const pool = require('../../databasePool');
const TrainingTable = require("../training/table");

const router = new Router();
router.post("/", async (req, res) => {
  try {
    const dataa = req.body.body;
    res.json({ worked: "yeey" });
    dataa.forEach(async (body) => {

      const newTodo = await pool.query(
        "insert into training ( category_id, title, price, capacity, training_language,imgurl,brief) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          body.category_id,
          body.title,
          body.price,
          body.capacity,
          body.language,
          body.imgurl,
          body.body,
        ]
      );
    });
  } catch (err) {
    console.log(`err`, err.message);
  }
});
module.exports = router;
