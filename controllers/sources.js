const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://minkascharff:k8oq9asWBe7XCulO@cluster0.8bxrnyh.mongodb.net/dashboarDB?retryWrites=true&w=majority";
const Source = require('../models/source');
const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');

//      Creates the source
// TODO POST /add-source
// ?    req.body = { name, lastActive, isActive, status, lastChecked, capacityLeft, totalCapacity, freeMemory, totalMemory, isMachine }
module.exports.createSource = (req, res) => {
    const { name, lastActive, isActive, url, status, lastChecked, capacityLeft, totalCapacity, ip, freeMemory, totalMemory, isMachine } = req.body;
    const updatedAt = new Date();

    Source.create({ name, lastActive, lastChecked, status, isActive, url, capacityLeft, totalCapacity, updatedAt, ip, freeMemory, totalMemory, isMachine })
        .then((data) => {
            if (data) {
                return res.send({ message: `Source '${name}' created successfully!`, name: data.name })
            } else {
                return res.send({ message: `Something went wrong, Please try again.` })
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

//      Returns the source as is
// TODO GET /get/:id
// ?    req.params = { id }
module.exports.getSource = (req, res, next) => {
    const { id } = req.params;

    Source.findById({ _id: id })
        .then(async (source) => {
            if (!source) {
                throw new NotFoundError(`No source with this - ${id} ID, was found nor updated.`);
            } else {
                return res.send({ source, lastEntry: await getLastEntry(source.url) });
            }
        })
        .catch(next);
};

//      Deletes source
// TODO DELETE /remove-source/:name
// ?    req.params = { id }
module.exports.deleteSource = (req, res) => {
    const { id } = req.params;
    let filter;
    if (id) {
        filter = { _id: id };
    }

    Source.findByIdAndDelete(filter)
        .then((source) => {
            if (!source) {
                throw new NotFoundError(`No source with this - '${source.name}' name, was found nor updated.`);
            } else {
                return res.send(source);
            }
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send(err);
            }
        });
};

//      Returns all the sources there are
// TODO GET /get/all
// ?    req.params = { name }
module.exports.getAllSources = (req, res) => {
    Source.find({})
        .then(async (data) => {
            if (!data) {
                throw new NotFoundError(`No sources was found.`);
            } else {
                let newData = [];
                for (let i = 0; i < data.length; i++) {
                    newData[i] = { data: data[i], lastEntry: await getLastEntry(data[i].url) }
                }

                res.send(newData);
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

//      Updates a source by name 
// TODO PUT /update/:name
// ?    req.params = { name || ip }
// ?    req.body = { lastActive, isActive, status, lastChecked, capacityLeft, totalCapacity, freeMemory, totalMemory }
module.exports.updateSource = (req, res) => {
    const { name } = req.params;
    const { lastActive, isActive, status, lastChecked, url, capacityLeft, totalCapacity, freeMemory, totalMemory } = req.body;
    const updatedAt = new Date();

    let filter;
    if (name) {
        filter = { name };
    }
    const update = { lastActive, isActive, status, lastChecked, url, capacityLeft, totalCapacity, updatedAt, freeMemory, totalMemory };

    Source.findOneAndUpdate(filter, update)
        .then((data) => {
            if (!data) {
                Source.findOneAndUpdate({ url: `${name}` }, update)
                    .then((data2) => {
                        if (!data2) {
                            throw new NotFoundError(`No source with this - '${name}' name, was found nor updated.`);
                        } else {
                            return res.send({ message: 'Successfully updated.' });
                        }
                    })
                    .catch((err) => {
                        handleError(err, req, res);
                    })
            } else {
                return res.send({ message: 'Successfully updated.' });
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

//      Edits the source name and url by name 
// TODO PUT /edit/:currentName
// ?    req.params = { currentName }
// ?    req.body = { name, url }
module.exports.editSource = (req, res) => {
    const { id } = req.params;
    const { name, url } = req.body;

    const filter = { _id: id };
    const update = { name, url };

    Source.findOneAndUpdate(filter, update)
        .then((data) => {
            if (!data) {
                throw new NotFoundError(`No source with this - '${name}' name, was found nor updated.`);
            } else {
                return res.send({ message: 'Successfully updated.' });
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
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
