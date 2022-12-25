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

export default api;
