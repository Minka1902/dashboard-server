class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const checkError = (err, req, res) => {
  if (res && !res.headersSent) {
    if (err) {
      if (err.name == 'CastError') {
        return res.status(400).send({ message: 'Data invalid.' });
      } if (err.name == 'ForbiddenError') {
        return res.status(403).send({ message: 'Can`t delete object.' });
      } if (err.name == 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Object not found.' });
      } if (err.name == 'ValidationError') {
        return res.status(422).send({ message: 'Validation error.' });
      } if (err.name == 'PayloadTooLargeError') {
        return res.status(413).send({ message: 'Content to long.' })
      } if (err.code === 11000) {
        return res.status(500).send({ message: 'Source already exists', err: { name: err.name, keyValue: err.keyValue, message: err.errmsg } })
      } if (err.message.includes("No source with this - '") && err.message.includes("' name, was found nor updated.")) {
        return;
      } else {
        return res.send({ message: 'An error has occurred on the server.', error: err });
      }
    }
  }
};

const handleError = (err, req, res) => {
  checkError(err, req, res);
};

module.exports = { handleError, ErrorHandler };
