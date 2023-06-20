const sourceUpdate = require('../models/sourceUpdate');
const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');

//      Creates the source
// TODO POST /update
// ?    req.body = { memoryLeft, totalMemory }
module.exports.update = (req, res) => {
    const { memoryLeft, totalMemory, updatedAt } = req.body;

    sourceUpdate.create({ memoryLeft, totalMemory, updatedAt })
        .then((data) => {
            if (data) {
                return res.send({ id: data.id, memoryLeft: data.memoryLeft, totalMemory: data.totalMemory, updatedAt: data.updatedAt });
            } else {
                return res.send({ message: `Something went wrong, Please try again.` })
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

//      Returns the source as is
// TODO GET /get-all
// ?    req.params = { name }
module.exports.getAllUpdates = (req, res, next) => {
    sourceUpdate.find({})
        .then((data) => {
            if (!data) {
                throw new NotFoundError(`No updates was found.`);
            } else {
                res.send(data);
            }
        })
        .catch(next);
};

//      Deletes source
// TODO DELETE /delete-update/:id
// ?    req.params = { name }
module.exports.deleteUpdate = (req, res) => {
    const { id } = req.params;

    sourceUpdate.findByIdAndRemove(id)
        .orFail()
        .then((sourceUpdate) => {
            if (!sourceUpdate) {
                throw new NotFoundError(`No source with this - '${id}' ID, was found nor deleted.`);
            } else {
                return res.send(sourceUpdate);
            }
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send(err);
            }
        });
};
