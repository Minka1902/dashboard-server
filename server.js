const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const { errors } = require('celebrate');


// get Port, file path, folderName and mongoURI
const { PORT = 4000,
    mongoURI = "mongodb+srv://minka-epsg:kCCcG4k4LaD6DbEy@cluster0.khsprzk.mongodb.net/?retryWrites=true&w=majority" } = {};

// include these before other routes
app.options('*', cors());
app.use(cors());

// celebrate error handler
app.use(errors());

mongoose.connect(mongoURI)
    .catch((err) => {
        console.log(err);
    });

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {

});

app.listen(PORT, function () {
    console.log(`App is running on port ${PORT}`);
});
