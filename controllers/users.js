const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { JWT_SECRET = 'dev-secret' } = process.env;

// ////////////////////////////////////////////////////////////////
//      creates a user
// TODO POST /signup
// ?    req.body = {email, password, username}
module.exports.createUser = (req, res) => {
  const { email, password, username } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        username: username,
        email: email,
        password: hash, // adding the hash to the database
      })
        .then((user) => {
          return res.send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(400).send(err);
          } else {
            return res.status(500).send(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(err);
      } else {
        return res.status(500).send(err);
      }
    });
};

//      checks the email and password and returns a JWT
// TODO POST /signin
// ?    req.body = {email, password}
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('password')
    .then((user) => {
      if (!user) {
        return new NotFoundError('No user with matching Email found');
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              // the hashes didn't match, rejecting the promise
              res.send(new ValidationError('Incorrect password or email'));
              return;
            }

            let data = {
              time: Date(),
              userId: user._id,
            }
            const token = jwt.sign(data, JWT_SECRET);

            // successful authentication
            return res.send({ user: user, jwt: token });
          });
      }
    })
    .catch(next);
};

//      returns information about the logged-in user (email and name)
// TODO GET /users/me
// ?    req.userId = USER ID
module.exports.getCurrentUser = (req, res) => {
  const { userId } = req;

  User.findById(userId)
    .then((user) => {
      return res.send({ id: user._id, email: user.email, username: user.username });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(err);
      }
    });
};
