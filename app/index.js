const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const accountRouter = require("./api/account");
const productRouter = require("./api/product");
const serviceRouter = require("./api/service");

const trainingRouter = require("./api/training");
const tsegtseeRouter = require("./api/tsegtsee");
const editRouter = require("./api/edit");
const trainingUpload = require("./api/upload");
const training_categoryRouter = require("./api/training_category");
const uploadRouter = require("./api/uploadimg");
const assetRouter = require("./api/asset");
const bannerRouter = require("./api/bannerTs");
const newsRouter = require("./api/news");
const newsEditRouter = require("./api/newsEdit");
const newsAssetRouter = require("./api/newsAsset");
const newsView = require("./api/newsView");
const trainingView = require("./api/trainingView");
const ticketRouter = require("./api/ticket");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
};

corsOptions.credentials = true;

// app.use(cors({ origin: 'http://localhost:5000', credentials: false }));

app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "../public")));

app.use("/account", accountRouter);
app.use("/product", productRouter);
app.use("/service", serviceRouter);
app.use("/banner", bannerRouter);
app.use("/training", trainingRouter);
app.use("/edit", editRouter);
app.use("/trainingupload", trainingUpload);
app.use("/tsegtsee", tsegtseeRouter);
app.use("/upload", uploadRouter);
app.use("/training_category", training_categoryRouter);
app.use("/asset", assetRouter);
app.use("/banner", bannerRouter);
app.use("/news", newsRouter);
app.use("/newsEdit", newsEditRouter);
app.use("/newsAsset", newsAssetRouter);
app.use("/ticket", ticketRouter);
app.use("/newsView", newsView);

app.use("/trainingView", trainingView);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: "error",
    message: err.message,
  });
});

module.exports = app;
