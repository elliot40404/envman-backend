import express from 'express';
import * as envController from '../../controllers/environment.controller.js';
const api = express.Router();

/**
 * @route   GET /api/v1/environment
 * @desc    get an environment
 */
api.get('/', envController.getEnvironment);

/**
 * @route   POST /api/v1/environment
 * @desc    set environment variables
 */
api.post('/', envController.setEnvironment);


export default api;
