import { Organization, User, Invite } from '../db/db.js';
import {
    sendEmail,
    emailSubject,
    emailTemplates,
    formatUri,
} from '../helpers/email.js';

/**
 * @async
 * @function inviteUser
 * @description Service to invite a user
 * @param {Object} data
 * @param {String} data.email
 * @param {String} data.orgId
 * @param {Boolean} data.isAccountAdmin
 * @returns {Promise<User>} user
 * @throws {Error} if email is already in use
 * @throws {Error} if orgId is invalid
 * @throws {Error} if invite already exists
 * @throws {Error} if user already exists
 */
export const inviteUser = async (data) => {
    const { email, orgId, isAccountAdmin } = data;
    const [org, user, invite] = await Promise.all([
        Organization.findOne({ _id: orgId }),
        User.findOne({
            email,
        }),
        Invite.findOne({
            email,
            orgId,
        }),
    ]);
    if (!org) {
        throw new Error('Invalid organization id');
    }
    if (user) {
        throw new Error('User already exists');
    }
    if (invite) {
        throw new Error('Invite already exists');
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
    return newInvite;
};

/**
 * @async
 * @function acceptInvite
 * @description Service to accept an invite
 * @param {Object} data
 * @param {String} data.inviteId
 * @param {String} data.name
 * @returns {Promise<User>} user
 * @throws {Error} if inviteId is invalid
 */
export const acceptInvite = async (data) => {
    const { inviteId, name } = data;
    const invite = await Invite.findOne({ _id: inviteId });
    if (!invite) {
        throw new Error('Invalid invite id');
    }
    const user = await User.create({
        email: invite.email,
        name: name || "User's Name",
        orgId: invite.orgId,
        verified: true,
        isAccountAdmin: invite.isAccountAdmin,
    });
    await Invite.deleteOne({ _id: inviteId });
    return user;
};
