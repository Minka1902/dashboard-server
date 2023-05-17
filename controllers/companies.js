const Company = require('../models/company');
const { handleError } = require('../errors/ErrorHandler');
const NotFoundError = require('../errors/NotFoundError');

//      Creates the source
// TODO POST /create-company
// ?    req.body = { name, lastActive, isActive, status, lastChecked, memoryLeft, totalMemory }
module.exports.createCompany = (req, res) => {
    const { name, location } = req.body;

    Company.create({ name, location })
        .then((data) => {
            if (data) {
                return res.send({ message: `Comapny '${name}' created succesfully!` })
            } else {
                return res.send({ message: `Something went wrong, Please try again.` })
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
};

//      Returns the source as is
// TODO GET /find/:name
// ?    req.params = { name }
module.exports.findCompany = (req, res, next) => {
    const { name } = req.params;

    Company.findOne({ name })
        .then((company) => {
            if (!company) {
                throw new NotFoundError(`No company with this - '${name}' name, was found.`);
            } else {
                return res.send(true);
            }
        })
        .catch(next);
};

//      Deletes source
// TODO DELETE /close-company/:name
// ?    req.params = { name }
module.exports.closeCompany = (req, res) => {
    const { name } = req.params;

    Company.findOneAndDelete({ name })
        .then((company) => {
            if (!company) {
                throw new NotFoundError(`No source with this - '${name}' name, was found nor deleted.`);
            } else {
                return res.send(company);
            }
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send(err);
            }
        });
};

//      Updates a source by name 
// TODO PUT /change/:name
// ?    req.params = { name }
// ?    req.body = { lastActive, isActive, status, lastChecked, memoryLeft, totalMemory }
module.exports.updateCompany = (req, res) => {
    const { name } = req.params;
    const { location, newName } = req.body;

    const filter = { name };
    const update = { location, name: newName };

    Company.findOneAndUpdate(filter, update)
        .then((data) => {
            if (!data) {
                throw new NotFoundError(`No company with this - '${name}' name, was updated.`);
            } else {
                return res.send(data);
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        })
}
