const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const { getCurrentUser, createUser, login } = require('../controllers/users');

router.post('/signin', celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8),
    }),
}), login);

router.post('/signup', celebrate({
    body: Joi.object().keys({
        username: Joi.string().required().min(2).max(30),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    }),
}), createUser);

router.get('/users/me', auth, getCurrentUser);

module.exports = router;
