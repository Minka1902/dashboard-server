const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');
const mongoose = require('mongoose');

module.exports.addCollection = async (req, res) => {
    const { MongoClient } = require('mongodb');
    const mongoURI = "mongodb+srv://minkascharff:k8oq9asWBe7XCulO@cluster0.8bxrnyh.mongodb.net/dashboarDB?retryWrites=true&w=majority";
    const { name } = req.body;

    MongoClient.connect(mongoURI)
        .then((client) => {
            const database = client.db('dashboarDB');

            database.createCollection(name)
                .then((collection) => {
                    if (collection) {
                        res.send({ message: `The ${name} collection was created.` });
                    }
                })
                .catch((err) => {
                    if (err) {
                        res.send({ error: err });
                    }
                });
        }).catch((err) => {
            handleError(err);
        });
};

module.exports.addEntry = (req, res) => {
    const { memoryLeft, totalMemory, collectionName, checkedAt } = req.body;
    const collection = mongoose.connection.collection(collectionName);

    collection.insertOne({ memoryLeft, totalMemory, checkedAt })
        .then((data) => {
            if (data) {
                return res.send({ message: `Entry created successfully!` })
            } else {
                return res.send({ message: `Something went wrong, Please try again.` })
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

module.exports.getEntries = async (req, res) => {
    const { collectionName } = req.params;
    const collection = mongoose.connection.collection(collectionName);
    let dataArray = [];
    let counter = 0;
    const cursor = await collection.find({});
    if (cursor) {
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            if (doc) {
                counter++;
                dataArray.push(doc);
            }
        }
        if (counter === 0) {
            res.send({ found: counter, data: dataArray });
        } else {
            throw new NotFoundError(`No sources was found.`);
        }
    }
};
