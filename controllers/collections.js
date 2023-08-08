const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://minkascharff:k8oq9asWBe7XCulO@cluster0.8bxrnyh.mongodb.net/dashboarDB?retryWrites=true&w=majority";

//      Creates the collection
// TODO POST /create-collection
// ?    req.body = { name }
module.exports.addCollection = async (req, res) => {
    const { MongoClient } = require('mongodb');
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
module.exports.addEntry = async (req, res) => {
    const { memoryLeft, totalMemory, collectionName, checkedAt } = req.body;
    const collection = mongoose.connection.collection(collectionName);
    const lastEntry = await getLastEntry(collectionName);

    if (lastEntry.memoryLeft !== memoryLeft)
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
    else res.send({ message: `Memory remained the same.` });
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
            let tempDoc;
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                if (doc) {
                    const percent = doc.memoryLeft * 100;
                    tempDoc = { checkedAt: doc.checkedAt, percent: (percent / doc.totalMemory), totalMemory: doc.totalMemory, memoryLeft: doc.memoryLeft };
                    counter++;
                    dataArray.push(tempDoc);
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

//      Returns the last entry of a collection by name
// ?    gets collectionName
const getLastEntry = async (collectionName) => {
    if (collectionName) {
        const collection = mongoose.connection.collection(collectionName);
        const cursor = await collection.find().sort({ _id: -1 }).limit(1);
        let dataArray = [];
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            if (doc) {
                dataArray.push(doc);
            }
        }
        if (dataArray.length > 0) return dataArray[0];
        else return null;
    }
};

//      Deletes the collection by name
// TODO DELETE /collections/remove/:collectionName
// ?    req.params = { collectionName }
module.exports.deleteCollection = async (req, res) => {
    const { MongoClient } = require('mongodb');
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
