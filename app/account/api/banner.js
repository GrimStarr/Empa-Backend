const { Router } = require("express");
const BannerTable = require("../banner/table");

const { authenticatedAccount } = require("./helper");

const router = new Router();

router.post("/new", (req, res, next) => {
  const { banner } = req.body;

  // authenticatedAccount({ token: token })
  //     .then(({ authenticated }) => {
  //             return
  //         }
  //     )
  //     .then(() => res.json({ message: 'success' }))
  //     .catch(error => next(error));
  BannerTable.addBanner(banner);
  ret;
});

router.post("/update/:id", (req, res, next) => {
  const id = req.param.id;
  const { token, banner } = req.body;

  authenticatedAccount({ token: token })
    .then(({ authenticated }) => {
      return BannerTable.addBanner(id, banner);
    })
    .then(() => res.json({ message: "success" }))
    .catch((error) => next(error));
});

// router.get('/:id', (req, res, next) => {
//     const id = req.param.id;

//     BannerTable.getBanner(id)
//         .then(result => {
//             res.json(result);
//         })
//         .catch(error => next(error));
// });

router.get("/", (req, res, next) => {
  BannerTable.getAllBanners()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
