import { Organization, User, Project, Environment } from '../db/db.js';
import { ROLES } from '../db/models/project.js';

/**
 * @async
 * @function getEnvironment
 * @description Service to get an environment
 * @param {object} data - The data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 * @throws {Error} - If the user does not have access to the project
 * @throws {Error} - If the user does not have access to the environment
 */
export async function getEnvironment(data) {
    // TODO: checking for id's is repeated in multiple places and can be abstracted out
    const { orgId, projectId, userId, env } = data;
    const [org, project, user] = await Promise.all([
        Organization.findById(orgId),
        Project.findById(projectId),
        User.findById(userId),
    ]);
    // check if ids are valid
    if (!org || !project || !user) {
        throw new Error('Either the org, project or user id is invalid');
    }
    if (!user?.projects?.length || !user?.projects?.includes(projectId)) {
        throw new Error('The user does not have access to the project');
    }
    const projEnv = project.permissions.find(
        (p) => p.userId.toString() === userId
    );
    if (projEnv.role === ROLES.VIEWER && !projEnv.environments.includes(env)) {
        throw new Error('The user does not have access to environment');
    }
    const envData = await Environment.findOne({
        orgId,
        projectId,
        name: env,
    });
    return envData;
}

/**
 * @async
 * @function setEnvironment
 * @description Service to add environment variables
 * @param {object} data - The data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 * @throws {Error} - If the user does not have access to the project
 * @throws {Error} - If the user does not have access to the environment
 */
export async function setEnvironment(data) {
    const { orgId, projectId, userId, env, variables } = data;
    // TODO: replace with findOne and include orgId in filter
    const [org, project, user] = await Promise.all([
        Organization.findById(orgId),
        Project.findById(projectId),
        User.findById(userId),
    ]);
    // check if id's are valid
    if (!org || !project || !user) {
        throw new Error('Either the org, project or user id is invalid');
    }
    const userEnv = project.permissions.find(
        (p) => p.userId.toString() === userId
    );
    if (!userEnv) {
        throw new Error('The user does not have access to the project');
    }
    if (userEnv.role !== ROLES.ADMIN) {
        throw new Error('The user does not have permission to set environment');
    }
    // TODO: as of now, the whole environment is being replaced. This can be changed to only update/add the variables
    const envData = await Environment.findOneAndUpdate(
        {
            orgId,
            projectId,
            name: env,
        },
        {
            variables,
        },
        {
            new: true,
        }
    );
    return envData;
}
