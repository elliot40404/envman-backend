import express from 'express';
import * as userController from '../../controllers/user.controller.js';
const api = express.Router();

/**
 * @route   POST /api/v1/user
 * @desc    add user
 */
// api.post('/', userController.createUser);

/**
 * @route   GET /api/v1/user
 * @desc    get user by user id
 */
// api.get('/', userController.getUser);

/**
 * @route   POST /api/v1/user/invite
 * @desc    invite user
 */
api.post('/invite', userController.inviteUser);

/**
 * @route   GET /api/v1/user/invite
 * @desc    get user by invite id
 */
api.get('/invite', userController.acceptInvite);
// TODO: add route to resend invite
// TODO: add route to delete invite
// TODO: cannot hit this route as auth is required


export default api;
