import express from 'express';
import * as userController from '../../controllers/user.controller.js';
const api = express.Router();

/**
 * @route   POST /api/v1/user
 * @desc    add user from invite
 */
api.post('/', userController.createUser);

/**
 * @route   GET /api/v1/user
 * @desc    get user by user id
 */
api.get('/', userController.getUser);

/**
 * @route   POST /api/v1/user/invite
 * @desc    invite user
 */
api.post('/invite', userController.inviteUser);

/**
 * @route   GET /api/v1/user/invite
 * @desc    get user invites
 */
api.get('/invite', userController.getUserInvites);

/**
 * @route   DELETE /api/v1/user/invite
 * @desc    delete user invite
 */
api.delete('/invite', userController.deleteUserInvite);

// TODO: add route to delete invite
// NOTE: cannot proceed to accept invite as that needs login

export default api;
