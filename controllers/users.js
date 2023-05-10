const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const { JWT_SECRET = 'dev-secret' } = process.env;

// ////////////////////////////////////////////////////////////////
// creates a user with the passed
// email, password, and username.
// POST /signup
// ! request structure
// ? req.body = {email, password, username}
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

// ////////////////////////////////////////////////////////////////
// checks the email and password
// and returns a JWT
// POST /signin
// ! request structure
// ? req.body = {email, password}
module.exports.login = (req, res, next) => {
  console.log('Login Function');
  const { email, password } = req.body;

  User.findOne({ email }).select('password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              // the hashes didn't match, rejecting the promise
              return Promise.reject(new Error('Incorrect password or email'));
            }

            let data = {
              time: Date(),
              userId: user._id,
            }
            const token = jwt.sign(data, JWT_SECRET);
            // successful authentication
            return res.send({user: user, jwt: token});
          })
      }
    })
    .catch(next);
};

// ////////////////////////////////////////////////////////////////
// returns information about the logged-in user (email and name)
// GET /users/me
// ! request structure
// ? req.userId = USER ID
module.exports.getCurrentUser = (req, res) => {
  console.log('Get current user Function');
  const { userId } = req;

  User.findById(userId)
    .then((user) => {
      return res.send({ id: user._id, email: user.email, username: user.username, savedArticles: [] });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(err);
      }
    });
};