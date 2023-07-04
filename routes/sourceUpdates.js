const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { update, getAllUpdates, deleteUpdate } = require('../controllers/sourceUpdates');

router.get('/get-all', getAllUpdates);

router.post('/update', celebrate({
    body: Joi.object().keys({
        ip: Joi.string().required(),
        updatedAt: Joi.date().required(),
        totalMemory: Joi.number().required(),
        memoryLeft: Joi.number().required(),
    }),
}), update);

router.delete('/delete-update/:id', celebrate({
    params: Joi.object().keys({
        id: Joi.string().required().min(23).max(25),
    })
}), deleteUpdate);

module.exports = router;
