const Source = require('../models/source');
const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');

//      Creates the source
// TODO POST /add-source
// ?    req.body = { name, lastActive, isActive, status, lastChecked, memoryLeft, totalMemory }
module.exports.createSource = (req, res) => {
    const { name, lastActive, isActive, url, status, lastChecked, memoryLeft, totalMemory, ip } = req.body;
    const updatedAt = new Date();

    Source.create({ name, lastActive, lastChecked, status, isActive, url, memoryLeft, totalMemory, updatedAt, ip })
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
// TODO GET /get/:name
// ?    req.params = { id }
module.exports.getSource = (req, res, next) => {
    const { id } = req.params;

    Source.findById({ _id: id })
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
// ?    req.params = { name || ip }
// ?    req.body = { lastActive, isActive, status, lastChecked, memoryLeft, totalMemory }
module.exports.updateSource = (req, res) => {
    const { name } = req.params;
    const { lastActive, isActive, status, lastChecked, url, memoryLeft, totalMemory } = req.body;
    const updatedAt = new Date();
    let tempIsActive, tempStatus;
    if (!isActive) {
        if (updatedAt.getTime() - lastChecked.getTime() < 3000000) {
            tempIsActive = true;
            tempStatus = 200;
        } else {
            tempIsActive = false;
            tempStatus = status;
        }
    }

    let filter;
    if (name) {
        filter = { name };
    }
    const update = { lastActive, isActive: tempIsActive, status: tempStatus, lastChecked, url, memoryLeft, totalMemory, updatedAt };

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
