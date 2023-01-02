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
            email: Joi.string().required().email(),
        });
        await schema.validateAsync(req.body);
        res.json(await userService.createUser(req.body, req.user));
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
        const schema = Joi.object({
            userId: Joi.string().required().length(24).alphanum(),
            orgId: Joi.string().required().length(24).alphanum(),
            fetchId: Joi.string().optional().length(24).alphanum(),
        });
        await schema.validateAsync(req.query);
        res.json(await userService.getUser(req.query));
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
            userId: Joi.string().required().length(24).alphanum(),
        });
        await schema.validateAsync(req.body);
        res.json(await userService.inviteUser(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function getUserInvites
 * @description Controller to get user invites
 */
export async function getUserInvites(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().required().length(24).alphanum(),
            userId: Joi.string().required().length(24).alphanum(),
        });
        await schema.validateAsync(req.query);
        res.json(await userService.getUserInvites(req.query));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function deleteUserInvite
 * @description Controller to delete a user invite
 */
export async function deleteUserInvite(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().required().length(24).alphanum(),
            inviteId: Joi.string().required().length(24).alphanum(),
            userId: Joi.string().required().length(24).alphanum(),
        });
        await schema.validateAsync(req.body);
        res.json(await userService.deleteUserInvite(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @async
 * @function verifyEmail
 * @description Controller to verify email
 */
export async function verifyEmail(req, res, next) {
    try {
        const schema = Joi.object({
            verificationId: Joi.string().required().length(24).alphanum(),
        });
        await schema.validateAsync(req.query);
        res.json(await userService.verifyEmail(req.query));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}
