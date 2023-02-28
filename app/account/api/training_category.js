const { Router } = require("express");

const pool = require("../../databasePool");

const router = new Router();
router.post("/", async (req, res) => {
  try {
    const body = req.body.body;
    console.log(req.body);
    // const newTodo = await pool.query(
    //   "insert into training ( category_id, title, price, capacity, training_language,imgurl,brief) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    //   [
    //     body.category_id,
    //     body.title,
    //     body.price,
    //     body.capacity,
    //     body.language,
    //     body.imgurl,
    //     body.body,
    //   ]
    // );
    res.json({ worked: "hehe" });
  } catch (err) {
    console.log(`err`, err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM training_category ORDER BY id ASC"
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.log(`err`, err.message);
  }
});
module.exports = router;
