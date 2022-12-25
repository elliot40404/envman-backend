import { Organization, User, Project, Environment } from '../db/db.js';

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
    // check if org id is valid
    if (!org || !project || !user) {
        throw new Error('Either the org, project or user id is invalid');
    }
    const userEnv = user.projects.find(
        (p) => p.projectId.toString() === projectId
    );
    if (!userEnv) {
        throw new Error('The user does not have access to the project');
    }
    if (userEnv.isProjectViewer && !userEnv.environments.includes(env)) {
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
    const [org, project, user] = await Promise.all([
        Organization.findById(orgId),
        Project.findById(projectId),
        User.findById(userId),
    ]);
    // check if org id is valid
    if (!org || !project || !user) {
        throw new Error('Either the org, project or user id is invalid');
    }
    const userEnv = user.projects.find(
        (p) => p.projectId.toString() === projectId
    );
    if (!userEnv) {
        throw new Error('The user does not have access to the project');
    }
    if (userEnv.isProjectViewer) {
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
        }
    );
    return envData;
}
