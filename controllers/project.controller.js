import * as projectService from '../services/project.service.js';
import Joi from 'joi';

/**
 * @function createProject
 * @description Controller to create a project
 */
export async function createProject(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            orgId: Joi.string().length(24).alphanum().required(),
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
            name: Joi.string().min(3).max(30).required(),
        });
        await schema.validateAsync(req.body);
        res.json(await projectService.updateProject(req.body));
    } catch (err) {
        err.status = 400;
        next(err);
    }
}