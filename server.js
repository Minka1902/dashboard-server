const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');


// get Port, file path, folderName and mongoURI
const { PORT = 4000,
    mongoURI = "mongodb://localhost:27017/dashboarDB" } = process.env;
const app = express();

mongoose.connect(mongoURI)
    .catch((err) => {
        console.log(err);
    });

require('dotenv').config();

// include these before other routes
app.options('*', cors());
app.use(cors());

app.use(bodyParser.json()); // parse application/json

app.use(requestLogger);     // enabling the request logger

app.use(require('./routes/users'))

app.get('/', (req, res) => {

});

app.use(errorLogger);   // enabling the error logger
app.use(errors());      // celebrate error handler

app.listen(PORT, function () {
    console.log(`App is running on port ${PORT}`);
});
