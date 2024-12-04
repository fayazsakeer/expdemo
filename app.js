require('dotenv').config();
const express = require('express');
const mongoose = require('./db/connection');
const router = require('./routes/router');
const session = require('express-session');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(
    session({
        secret: 'yourSecretKey',
        resave: false,
        saveUninitialized: true,
    })
);


app.use('/', router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
