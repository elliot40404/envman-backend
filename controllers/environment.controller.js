import * as envService from '../services/environment.service.js';
import Joi from 'joi';
import { ENVIRONMENTS } from '../db/models/environment.js';

/**
 * @function getEnvironment
 * @description Controller to get an environment
 */
export async function getEnvironment(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            env: Joi.string()
                .valid(...Object.values(ENVIRONMENTS))
                .required(),
        });
        await schema.validateAsync(req.query);
        res.json(await envService.getEnvironment(req.query));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function setEnvironment
 * @description Controller to add environment variables
 */
export async function setEnvironment(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            env: Joi.string()
                .valid(...Object.values(ENVIRONMENTS))
                .required(),
            variables: Joi.array()
                .items(
                    Joi.object({
                        key: Joi.string().required(),
                        value: Joi.string().required(),
                    })
                )
                .required(),
        });
        await schema.validateAsync(req.body);
        res.json(await envService.setEnvironment(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}
