const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllSources, getSource, createSource, deleteSource, updateSource, editSource } = require('../controllers/sources');

router.get('/get/all', getAllSources);

router.get('/get/:id', celebrate({
    params: Joi.object().keys({
        id: Joi.string().required().min(24).max(24),
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
    }),
}), createSource);

router.delete('/remove-source/:id', celebrate({
    params: Joi.object().keys({
        id: Joi.string().required().min(24).max(24),
    })
}), deleteSource);

router.put('/update/:name', celebrate({
    body: Joi.object().keys({
        lastActive: Joi.date(),
        isActive: Joi.boolean(),
        url: Joi.string(),
        status: Joi.number(),
        lastChecked: Joi.date().required(),
        memoryLeft: Joi.number(),
        totalMemory: Joi.number(),
        updatedAt: Joi.date(),
    }),
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    })
}), updateSource);

router.put('/edit/:id', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        url: Joi.string(),
    }),
    params: Joi.object().keys({
        id: Joi.string().required().min(24).max(24),
    }),
}), editSource);

module.exports = router;
