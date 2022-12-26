import express from 'express';
import * as projectController from '../../controllers/project.controller.js';
const api = express.Router();

/**
 * @route   POST api/v1/project
 * @desc    create project
 */
api.post('/', projectController.createProject);

/**
 * @route   GET api/v1/project
 * @desc    get project(s)
 */
api.get('/', projectController.getProject);

/**
 * @route   DELETE api/v1/project
 * @desc    delete project
 */
api.delete('/', projectController.deleteProject);

/**
 * @route   PATCH api/v1/project
 * @desc    update project
 */
api.patch('/', projectController.updateProject);

/**
 * @route   POST /api/v1/project/user
 * @desc    add user to project
 */
api.post('/user', projectController.addUser);

/**
 * @route   DELETE /api/v1/project/user
 * @desc    remove user from project
 */
api.delete('/user', projectController.removeUser);

/**
 * @route   PATCH /api/v1/project/user
 * @desc    modify user role in project
 */
api.patch('/user', projectController.modUserRole);

/**
 * @route   POST /api/v1/project/user/environment
 * @desc    add environment to user in project
 */
api.post('/user/environment', projectController.modEnvironment);

/**
 * @route   DELETE /api/v1/project/user/environment
 * @desc    remove environment from user in project
 */
api.delete('/user/environment', projectController.modEnvironment);

export default api;
