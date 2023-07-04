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
        ip: Joi.string(),
        url: Joi.string().required(),
        lastActive: Joi.date().required(),
        isActive: Joi.boolean().required(),
        status: Joi.number().required(),
        lastChecked: Joi.date().required(),
        memoryLeft: Joi.number(),
        totalMemory: Joi.number(),
        isMemory: Joi.boolean().required(),
    }),
}), createSource);

router.delete('/remove-source/:name', celebrate({
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    })
}), deleteSource);

router.delete('/remove-source/:ip', celebrate({
    params: Joi.object().keys({
        ip: Joi.string().required(),
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
        updatedAt: Joi.date().required(),
    }),
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    })
}), updateSource);

router.put('/update/:ip', celebrate({
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
        ip: Joi.string().required(),
    })
}), updateSource);

module.exports = router;
