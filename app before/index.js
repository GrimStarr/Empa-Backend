const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const accountRouter = require('./api/account');
const productRouter = require('./api/product');
const serviceRouter = require('./api/service');
const bannerRouter = require('./api/banner');
const trainingRouter = require('./api/training');
const tsegtseeRouter = require('./api/tsegtsee');

const app = express();

// app.use(cors({ origin: 'http://localhost:5000', credentials: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname,'../public')));

app.use('/account', accountRouter);
app.use('/product', productRouter);
app.use('/service', serviceRouter);
app.use('/banner', bannerRouter);
app.use('/training', trainingRouter);
app.use('/tsegtsee', tsegtseeRouter);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        type: 'error', message: err.message
    })
});

module.exports = app;
