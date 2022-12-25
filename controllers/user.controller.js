import * as organizationService from '../services/organization.service.js';
import Joi from 'joi';

/**
 * @function createOrg
 * @description Controller to create a organization
 */
export async function createOrg(req, res, next) {
    try {
        // TODO: Add email verification
        const schema = Joi.object({
            email: Joi.string().email().required(),
            name: Joi.string().min(3).max(30).required(),
            orgName: Joi.string().min(3).max(30).required(),
        });
        await schema.validateAsync(req.body);
        res.json(await organizationService.createOrg(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function getOrg
 * @description Controller to get a organization by adminId or orgId
 */
export async function getOrg(req, res, next) {
    try {
        // require adminId or orgId
        const schema = Joi.object({
            adminId: Joi.string().optional().length(24).alphanum(),
            orgId: Joi.string().optional().length(24).alphanum(),
        }).or('adminId', 'orgId');
        await schema.validateAsync(req.query);
        res.json(await organizationService.getOrg(req.query));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}
