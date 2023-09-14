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
// ?    req.body = { capacityLeft, totalCapacity, collectionName, checkedAt, isActive, status, totalMemory, freeMemory }
module.exports.addEntry = async (req, res) => {
    const { capacityLeft, totalCapacity, collectionName, checkedAt, isActive, status, totalMemory, freeMemory } = req.body;
    const collection = mongoose.connection.collection(collectionName);

    collection.insertOne({ capacityLeft, totalCapacity, checkedAt, isActive, status, totalMemory, freeMemory })
        .then((data) => {
            if (data.acknowledged) {
                return res.send({ message: `Entry created successfully!` })
            } else {
                return res.send({ message: `Something went wrong, Please try again.` })
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        });
};

//      Returns all entries by collection name
// TODO GET /collection/:collectionName
// ?    req.params = { collectionName }
module.exports.getEntries = async (req, res) => {
    const { collectionName } = req.params;
    if (collectionName === 'users' || collectionName === 'sources') {
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
                    const capacityPercent = doc.capacityLeft * 100;
                    const memoryPercent = doc.freeMemory * 100;
                    if (doc.capacityLeft !== null) {
                        tempDoc = { checkedAt: doc.checkedAt, capacityPercent: (capacityPercent / doc.totalCapacity), memoryPercent: (memoryPercent / doc.totalMemory), totalCapacity: doc.totalCapacity, capacityLeft: doc.capacityLeft, totalMemory: doc.totalMemory, freeMemory: doc.freeMemory };
                    } else {
                        tempDoc = { checkedAt: doc.checkedAt, status: doc.status, isActive: doc.isActive };
                    }
                    counter++;
                    dataArray.push(tempDoc);
                }
            }
            if (counter !== 0) {
                res.send({ found: counter, lastEntry: await getLastEntry(collectionName), data: dataArray });
            } else {
                res.send(new NotFoundError(`No sources was found.`));
            }
        }
    }
};

const getLastEntry = async (collectionName) => {
    if (collectionName) {
        const collection = mongoose.connection.collection(collectionName);
        const lastEntry = await collection.findOne({}, { sort: { _id: -1 } });
        if (lastEntry) {
            let temp = {};
            for (let prop in lastEntry) {
                if (lastEntry[prop] !== null && prop !== '_id') {
                    temp[prop] = lastEntry[prop];
                }
            }
            return temp;
        } else return null;
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
