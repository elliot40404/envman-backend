import express from 'express';
import * as projectController from '../../controllers/project.controller.js';
const api = express.Router();

/**
 * @route   POST api/v1/project
 * @desc    create project
 */
api.post('/', projectController.createProject);

/**
 * @route   POST api/v1/project
 * @desc    get project(s)
 */
api.get('/', projectController.getProject);

export default api;
