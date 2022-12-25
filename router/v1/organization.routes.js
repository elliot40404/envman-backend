import express from 'express';
import * as organizationController from '../../controllers/organization.controller.js';
const api = express.Router();

/**
 * @route   POST api/v1/organization
 * @desc    create organization
 */
api.post('/', organizationController.createOrg);

/**
 * @route   POST api/v1/organization
 * @desc    get organization
 */
api.get('/', organizationController.getOrg);

export default api;
