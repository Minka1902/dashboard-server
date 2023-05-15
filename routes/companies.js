const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCompany, findCompany, updateCompany, closeCompany } = require('../controllers/companies');

router.get('/find/:name', celebrate({
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    }),
}), findCompany);

router.post('/create-company', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        location: Joi.string(),
    }),
}), createCompany);

router.delete('/remove-source/:name', celebrate({
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    })
}), closeCompany);

router.put('/update/:name', celebrate({
    body: Joi.object().keys({
        location: Joi.string(),
        newName: Joi.string().min(2).max(30),
    }),
    params: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
    })
}), updateCompany);

module.exports = router;
