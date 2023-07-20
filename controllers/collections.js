const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');
const mongoose = require('mongoose');

//      Creates the collection
// TODO POST /create-collection
// ?    req.body = { name }
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

//      Creates an entry
// TODO POST /add-entry
// ?    req.body = { memoryLeft, totalMemory, collectionName, checkedAt }
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

//      Returns all entries by collection name
// TODO GET /collection/:collectionName
// ?    req.params = { collectionName }
module.exports.getEntries = async (req, res) => {
    const { collectionName } = req.params;
    if (collectionName === 'users') {
        res.status(404).send({ message: "NOT ALLOWED!!!", status: 404, reason: "Can't access this collection." });
    } else {
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
            if (counter !== 0) {
                res.send({ found: counter, data: dataArray });
            } else {
                res.send(new NotFoundError(`No sources was found.`));
            }
        }
    }
};

//      Deletes the collection by name
// TODO DELETE /collections/remove/:collectionName
// ?    req.params = { collectionName }
module.exports.deleteCollection = async (req, res) => {
    const { MongoClient } = require('mongodb');
    const mongoURI = "mongodb+srv://minkascharff:k8oq9asWBe7XCulO@cluster0.8bxrnyh.mongodb.net/dashboarDB?retryWrites=true&w=majority";
    const { collectionName } = req.params;

    MongoClient.connect(mongoURI)
        .then((client) => {
            const database = client.db('dashboarDB');

            database.collection(collectionName).drop()
                .then((delOK) => {
                    if (delOK) {
                        res.status(200).send({ message: 'Collection deleted successfully.', collectionDropped: collectionName });
                    }
                })
                .catch((err) => {
                    handleError(err);
                })

        }).catch((err) => {
            handleError(err);
        });
};
