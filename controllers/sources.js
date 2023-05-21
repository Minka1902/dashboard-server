const Source = require('../models/source');
const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');

//      Creates the source
// TODO POST /add-source
// ?    req.body = { name, lastActive, isActive, status, lastChecked, memoryLeft, totalMemory }
module.exports.createSource = (req, res) => {
    const { name, lastActive, isActive, url, status, lastChecked, memoryLeft, totalMemory, isMemory } = req.body;
    const updatedAt = new Date();

    Source.create({ name, lastActive, lastChecked, status, isActive, url, memoryLeft, totalMemory, isMemory, updatedAt })
        .then((data) => {
            if (data) {
                return res.send({ message: `Source '${name}' created succesfully!` })
            } else {
                return res.send({ message: `Something went wrong, Please try again.` })
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

//      Returns the source as is
// TODO GET /get/:name
// ?    req.params = { name }
module.exports.getSource = (req, res, next) => {
    const { name } = req.params;

    Source.findOne({ name })
        .then((source) => {
            if (!source) {
                throw new NotFoundError(`No source with this - '${name}' name, was found nor updated.`);
            } else {
                return res.send(source);
            }
        })
        .catch(next);
};

//      Deletes source
// TODO DELETE /remove-source/:name
// ?    req.params = { name }
module.exports.deleteSource = (req, res) => {
    const { name } = req.params;

    Source.findOneAndDelete({ name })
        .then((source) => {
            if (!source) {
                throw new NotFoundError(`No source with this - '${name}' name, was found nor updated.`);
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
        .then((data) => {
            if (!data) {
                throw new NotFoundError(`No sources was found.`);
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

//      Updates a source by name 
// TODO PUT /update/:name
// ?    req.params = { name }
// ?    req.body = { lastActive, isActive, status, lastChecked, memoryLeft, totalMemory }
module.exports.updateSource = (req, res) => {
    const { name } = req.params;
    const { lastActive, isActive, status, lastChecked, url, memoryLeft, totalMemory } = req.body;
    const updatedAt = new Date();

    const filter = { name };
    const update = { lastActive, isActive, status, lastChecked, url, memoryLeft, totalMemory, updatedAt };

    Source.findOneAndUpdate(filter, update)
        .then((data) => {
            if (!data) {
                throw new NotFoundError(`No source with this - '${name}' name, was found nor updated.`);
            } else {
                return res.send({ message: 'Succesfully updated.' });
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
}
