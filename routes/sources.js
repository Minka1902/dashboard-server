const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllSources, getSource, createSource, deleteSource, updateSource } = require('../controllers/sources');

router.get('/get/all', getAllSources);

router.get('/get/:name', celebrate({
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    }),
}), getSource);

router.post('/add-source', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        url: Joi.string().required(),
        lastActive: Joi.date().required(),
        isActive: Joi.boolean().required(),
        status: Joi.number().required(),
        lastChecked: Joi.date().required(),
        memoryLeft: Joi.number(),
        totalMemory: Joi.number(),
    }),
}), createSource);

router.delete('/remove-source/:name', celebrate({
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    })
}), deleteSource);

router.put('/update/:name', celebrate({
    body: Joi.object().keys({
        lastActive: Joi.date(),
        isActive: Joi.boolean(),
        url: Joi.string(),
        status: Joi.number(),
        lastChecked: Joi.date(),
        memoryLeft: Joi.number(),
        totalMemory: Joi.number(),
    }),
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    })
}), updateSource);

module.exports = router;
