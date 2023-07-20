const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { addCollection, getEntries, addEntry, deleteCollection } = require('../controllers/collections');

router.post('/create-collection', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    }),
}), addCollection);

router.post('/add-entry', celebrate({
    body: Joi.object().keys({
        totalMemory: Joi.number().required(),
        memoryLeft: Joi.number(),
        checkedAt: Joi.date().required(),
        collectionName: Joi.string().required(),
    })
}), addEntry);

router.get('/collection/:collectionName', celebrate({
    params: Joi.object().keys({
        collectionName: Joi.string().required(),
    })
}), getEntries);

router.delete('/collections/remove/:collectionName', celebrate({
    params: Joi.object().keys({
        collectionName: Joi.string().required(),
    })
}), deleteCollection);

module.exports = router;
