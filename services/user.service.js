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
    const { adminId, orgId } = data;
    const organization = await Organization.findOne({
        $or: [{ adminId }, { _id: orgId }],
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    return organization;
}
