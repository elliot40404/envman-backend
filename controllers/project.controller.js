import * as projectService from '../services/project.service.js';
import Joi from 'joi';
import { ROLES } from '../db/models/project.js';
import { ENVIRONMENTS } from '../db/models/environment.js';

/**
 * @function createProject
 * @description Controller to create a project
 */
export async function createProject(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            orgId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
        });
        await schema.validateAsync(req.body);
        res.json(await projectService.createProject(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function getProject
 * @description Controller to get a project by id or all projects
 */
export async function getProject(req, res, next) {
    try {
        // validate string length and alphanum
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().optional(),
            userId: Joi.string().length(24).alphanum().required(),
        });
        await schema.validateAsync(req.query);
        res.json(await projectService.getProject(req.query));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function deleteProject
 * @description Controller to delete a project
 */
export async function deleteProject(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
        });
        await schema.validateAsync(req.body);
        res.json(await projectService.deleteProject(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function updateProject
 * @description Controller to update a project
 */
export async function updateProject(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
            name: Joi.string().min(3).max(30).required(),
        });
        await schema.validateAsync(req.body);
        res.json(await projectService.updateProject(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function addUser
 * @description Controller to add a user to a project
 */
export async function addUser(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
            addId: Joi.string().length(24).alphanum().required(),
            role: Joi.string()
                .valid(...Object.values(ROLES))
                .required(),
            envs: Joi.array()
                .items(Joi.string().valid(...Object.values(ENVIRONMENTS)))
                .min(1)
                .max(3)
                .required(),
        });
        await schema.validateAsync(req.body);
        res.json(await projectService.addUser(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function removeUser
 * @description Controller to remove a user from a project
 */
export async function removeUser(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
            removeId: Joi.string().length(24).alphanum().required(),
        });
        await schema.validateAsync(req.body);
        res.json(await projectService.removeUser(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function modifyUserRole
 * @description Controller to modify a user's role in a project
 */
export async function modUserRole(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
            role: Joi.string()
                .valid(...Object.values(ROLES))
                .required(),
        });
        await schema.validateAsync(req.body);
        res.json(await projectService.modUserRole(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

/**
 * @function modEnvironment
 * @description Controller to add an environment to a user
 */
export async function modEnvironment(req, res, next) {
    try {
        const schema = Joi.object({
            orgId: Joi.string().length(24).alphanum().required(),
            projectId: Joi.string().length(24).alphanum().required(),
            userId: Joi.string().length(24).alphanum().required(),
            env: Joi.string()
                .valid(...Object.values(ENVIRONMENTS))
                .required(),
        });
        await schema.validateAsync(req.body);
        // check method
        if (req.method === 'POST') {
            res.json(await projectService.addEnvironment(req.body));
        } else if (req.method === 'DELETE') {
            res.json(await projectService.removeEnvironment(req.body));
        }
    } catch (err) {
        err.status = 400;
        next(err);
    }
}
