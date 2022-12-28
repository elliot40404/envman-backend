import * as userService from '../services/user.service.js';
import Joi from 'joi';

/**
 * @function createUser
 * @description controller to add a user to an organization
 */
export async function createUser(req, res, next) {
    try {
        const schema = Joi.object({
            invitationId: Joi.string().required().length(24).alphanum(),
            name: Joi.string().required().min(3).max(30),
        });
        await schema.validateAsync(req.body);
        res.json(await userService.createUser(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function getUser
 * @description Controller to get a user
 */
export async function getUser(req, res, next) {
    try {
        // require adminId or orgId
        const schema = Joi.object({
            adminId: Joi.string().optional().length(24).alphanum(),
            orgId: Joi.string().optional().length(24).alphanum(),
        }).or('adminId', 'orgId');
        await schema.validateAsync(req.query);
        res.json(await userService.getOrg(req.query));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function inviteUser
 * @description Controller to invite a user
 */
export async function inviteUser(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            orgId: Joi.string().required().length(24).alphanum(),
            isAccountAdmin: Joi.boolean().optional(),
        });
        await schema.validateAsync(req.body);
        res.json(await userService.inviteUser(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function acceptInvite
 * @description Controller to accept an invite
 */
export async function acceptInvite(req, res, next) {
    try {
        const schema = Joi.object({
            invitationId: Joi.string().required().length(24).alphanum(),
        });
        await schema.validateAsync(req.query);
        res.json(await userService.acceptInvite(req.query));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}
