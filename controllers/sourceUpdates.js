const sourceUpdate = require('../models/sourceUpdate');
const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');

//      Creates the source
// TODO POST /update
// ?    req.body = { memoryLeft, totalMemory, updatedAt, ip}
module.exports.update = (req, res) => {
    const { memoryLeft, totalMemory, updatedAt, ip } = req.body;

    sourceUpdate.create({ memoryLeft, totalMemory, updatedAt, ip })
        .then((data) => {
            if (data) {
                return res.send({ id: data.id, memoryLeft: data.memoryLeft, totalMemory: data.totalMemory, updatedAt: data.updatedAt, ip: data.ip });
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
// ?    req.params = { id/ip }
module.exports.deleteUpdate = (req, res) => {
    const { id, ip } = req.params;
    let filter;
    if (id) {
        filter = id;
    } else {
        filter = ip;
    }

    sourceUpdate.findByIdAndRemove(filter)
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
