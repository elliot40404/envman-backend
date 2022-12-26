import { Organization, User } from '../db/db.js';

/**
 * @async
 * @function createOrg
 * @description Service to create a new organization and first user(super admin)
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of data is invalid
 */
export async function createOrg(data) {
    const { orgName, email, name } = data;
    const user = await User.create({ email, name, isSuperAdmin: true });
    const organization = await Organization.create({
        name: orgName,
        adminId: user.id,
    });
    await User.updateOne({ _id: user.id }, { orgId: organization.id });
    return { organization, user };
}

/**
 * @async
 * @function getOrg
 * @description Service to get a organization
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 */
export async function getOrg(data) {
    const { adminId, orgId, userId } = data;
    const [organization, user] = await Promise.all([
        Organization.findOne({
            $or: [{ adminId }, { _id: orgId }],
        }),
        User.findOne({ _id: userId, orgId }),
    ]);
    if (!organization || !user) {
        throw new Error('Organization or user not found');
    }
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('User does not have access to get organization');
    }
    return organization;
}
