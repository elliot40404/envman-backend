import {Invite, Organization, User} from '../db/db.js';
import {emailSubject, emailTemplates, formatUri, sendEmail,} from '../helpers/email.js';

/**
 * @async
 * @function createUser
 * @description Service to add a user to an organization
 * @param {Object} data
 * @param {String} data.invitationId
 * @param {String} data.name
 * @returns {Promise<User>} user
 * @throws {Error} if inviteId is invalid
 * @throws {Error} if user already exists
 */
export const createUser = async (data) => {
    const { name, invitationId } = data;
    const invite = await Invite.findOne({
        _id: invitationId,
    });
    console.log(invite);
    if (!invite) {
        throw new Error('Invalid invite id');
    }
    const user = await User.findOne({
        email: invite.email,
    });
    if (user) {
        throw new Error('User already exists');
    }
    const [newUser] = await Promise.all([
        User.create({
            email: invite.email,
            name,
            orgId: invite.orgId,
            isAccountAdmin: invite.isAccountAdmin || false,
            verified: true,
        }),
        Invite.deleteOne({
            _id: invitationId,
        }),
    ]);
    return newUser;
};

/**
 * @async
 * @function getUser
 * @description Service to get a user by user id or by org
 * @param {Object} data
 * @param {String} data.userId
 * @param {String} data.orgId
 * @param {String} data.fetchId
 * @returns {Promise<User>|Promise<User[]>} user
 */
export const getUser = async (data) => {
    const { userId, orgId, fetchId } = data;
    if (!fetchId) {
        const user = await User.findOne({
            _id: userId,
            orgId,
        });
        if (!user) {
            throw new Error('Invalid user id');
        }
        // check if user is admin
        if (!user.isAccountAdmin && !user.isSuperAdmin) {
            throw new Error('Unauthorized');
        }
        return await User.find({
            orgId,
        });
    } else {
        return await User.findOne({
            _id: fetchId,
            orgId,
        });
    }
};

/**
 * @async
 * @function inviteUser
 * @description Service to invite a user
 * @param {Object} data
 * @param {String} data.email
 * @param {String} data.orgId
 * @param {Boolean} data.isAccountAdmin
 * @param {String} data.userId
 * @returns {String} user
 * @throws {Error} if email is already in use
 * @throws {Error} if orgId is invalid
 * @throws {Error} if invite already exists
 * @throws {Error} if user already exists
 */
export const inviteUser = async (data) => {
    const { email, orgId, isAccountAdmin, userId } = data;
    const [org, user, invite, admin] = await Promise.all([
        Organization.findOne({ _id: orgId }),
        User.findOne({
            email,
        }),
        Invite.findOne({
            email,
            orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
    ]);
    if (!org || !admin) {
        throw new Error('Invalid organization or userId id');
    }
    if (!admin.isAccountAdmin && !admin.isSuperAdmin) {
        throw new Error('Unauthorized');
    }
    if (user) {
        throw new Error('User with email already exists');
    }
    if (invite) {
        throw new Error('Invite for email already exists');
    }
    const newInvite = await Invite.create({
        email,
        orgId,
        isAccountAdmin: isAccountAdmin || false,
    });
    await sendEmail(
        email,
        emailSubject.inviteEmail,
        emailTemplates.inviteEmail(org.name, formatUri(newInvite.id))
    );
    return {
        message: 'Invite sent',
    };
};

/**
 * @async
 * @function getUserInvites
 * @description Service to get user invites
 * @param {Object} data
 * @param {String} data.orgId
 * @returns {Promise<Invite[]>} invites
 * @throws {Error} if orgId is invalid
 * @throws {Error} if user is not super admin or account admin
 */
export const getUserInvites = async (data) => {
    const { orgId, userId } = data;
    const [org, user] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
    ]);
    if (!org || !user) {
        throw new Error('Invalid organization or user id');
    }
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('Unauthorized');
    }
    return await Invite.find({
        orgId,
    });
};

/**
 * @async
 * @function deleteUserInvite
 * @description Service to delete a user invite
 * @param {Object} data
 * @param {String} data.inviteId
 * @param {String} data.orgId
 * @param {String} data.userId
 * @returns {String} invite
 * @throws {Error} if orgId is invalid
 * @throws {Error} if user is not super admin or account admin
 */
export const deleteUserInvite = async (data) => {
    const { inviteId, orgId, userId } = data;
    const [org, user, invite] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
        Invite.findOne({
            _id: inviteId,
            orgId,
        }),
    ]);
    if (!org || !user) {
        throw new Error('Invalid organization or user id');
    }
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('Unauthorized');
    }
    if (!invite) {
        throw new Error('Invalid invite id');
    }
    await Invite.deleteOne({
        _id: inviteId,
        orgId,
    });
    return {
        message: 'Invite deleted successfully',
    };
};

/**
 * @async
 * @function verifyEmail
 * @description Service to verify email
 * @param {Object} data
 * @param {String} data.verificationId
 * @returns {String} user
 * @throws {Error} if verificationId is invalid
 */
export const verifyEmail = async (data) => {
    const { verificationId } = data;
    const user = await User.findOne({
        _id: verificationId,
    }
    );
    if (!user) {
        throw new Error('Invalid verification id');
    }
    if (user.verified) {
        throw new Error('Email already verified');
    }
    user.verified = true;
    await user.save();
    return {
        message: 'Email verified successfully',
    }
}