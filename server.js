const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');

// get Port, file path, folderName and mongoURI
const { PORT = 4001,
    folderName = 'dashboard',
    mongoURI = "mongodb+srv://minkascharff:k8oq9asWBe7XCulO@cluster0.8bxrnyh.mongodb.net/dashboarDB?retryWrites=true&w=majority" } = process.env;
const app = express();

mongoose.connect(mongoURI)
    .catch((err) => {
        console.log(err);
    });

require('dotenv').config();

// include these before other routes
app.options('*', cors());
app.use(cors());

// const removeIndexedChar = (str, index) => {
//     let tempStr = '';
//     for (let i = 0; i < str.length; i++) {
//         if (i !== index - 1) {
//             tempStr += str[i];
//         }
//     }
//     return tempStr;
// };

// app.get('/edit123File', (req, res) => {
//     let returnText = '';
//     let isFirst = true;
//     let tempRow = '';
//     let isIndex2 = false;
//     const fromProj = epsg[`EPSG:4326`];
//     const toProj = epsg[`EPSG:26714`];
//     const readStream = fs.createReadStream('./123.txt', { encoding: 'utf8' });
//     const writeStream = fs.createWriteStream('./LATINA__with_NAD27-ZONE14.txt.txt');
//     readStream.on('data', (chunk) => {
//         let newArr = '';
//         if (chunk) {
//             const tRegex = /\t/g;
//             newArr = chunk.replace(tRegex, ",");
//             if (newArr) {
//                 newArr = newArr.split('\r\n');
//                 // ? if there is a remainder from the last reading it`ll be remembered here
//                 if (tempRow) {
//                     let tempStr = '';
//                     if (newArr[0][newArr[0].length - 1] === ',') {
//                         tempStr = removeIndexedChar(newArr[0], newArr[0].length);
//                         tempRow = removeIndexedChar(tempRow, tempRow.length);
//                     }
//                     tempRow += `${tempStr}`;
//                     let arr = tempRow.split(',').map(parseFloat);

//                     if (!isIndex2 && arr[2]) {
//                         arr[2] = arr[2] / 1000;
//                     }
//                     if (arr[3]) {
//                         returnText = `${arr[0]}\t${arr[1]}\t${arr[2]}\t${arr[3]}\r\n`;
//                     }

//                     tempRow = '';
//                 }
//                 // ? checkes if its the first page
//                 if (isFirst) {
//                     returnText = `${newArr[0]}\r\n${newArr[1]}\r\n${newArr[2]}\r\n${newArr[3]}\r\n${newArr[4]}\r\n${newArr[5]}\r\n`;
//                 }
//                 for (let i = isFirst ? 6 : 0; i < newArr.length; i++) {
//                     let arr = newArr[i].split(',').map(parseFloat);
//                     arr.splice(4, 1);
//                     for (let j = 0; j < arr.length; j++) {
//                         if (!arr[j] && arr[j] !== 0) {
//                             arr.splice(j, 1);
//                         }
//                     }
//                     let coords = [];
//                     coords = newArr[i].split(',').map(parseFloat);
//                     if (coords) {
//                         let coordinates = proj4(toProj, fromProj, [coords[0], coords[1]]);
//                         // final += `${coordinates[0]} ${coordinates[1]}\r\n`;
//                         console.log(coords);
//                     }


//                     if (arr[3] || arr[3] === 0) {
//                         returnText += `${arr[0]}\t${arr[1]}\t${arr[2]}\t${arr[3]}\r\n`;
//                     } else {
//                         if (i !== 0) {
//                             tempRow = '';
//                             for (let j = 0; j < arr.length; j++) {
//                                 tempRow += `${arr[j]},`;
//                             }
//                         }
//                         if (arr[2]) {
//                             isIndex2 = true;
//                         } else {
//                             isIndex2 = false;
//                         }
//                     }
//                 }
//                 isFirst = false;
//             }
//             writeStream.write(returnText);
//             returnText = '';
//         }

//     });

//     readStream.on('end', () => {
//         console.log('File read complete.');
//     });

//     readStream.on('error', (err) => {
//         console.error(err);
//     });
// });

app.use(bodyParser.json()); // parse application/json

app.use(requestLogger);     // enabling the request logger

app.use(require('./routes/users'));
app.use(require('./routes/sources'));
app.use(require('./routes/sourceUpdates'));

app.use(express.static(`../${folderName}/build`));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..') + `/${folderName}/build/index.html`);
});

app.use(errorLogger);   // enabling the error logger
app.use(errors());      // celebrate error handler

app.listen(PORT, function () {
    console.log(`App is running on port ${PORT}`);
});
