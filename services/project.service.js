import { Organization, User, Project, Environment } from '../db/db.js';
import { ENVIRONMENTS } from '../db/models/environment.js';
import 'dotenv/config';

const MAX_PROJECTS = process.env.MAX_PROJECTS
    ? parseInt(process.env.MAX_PROJECTS)
    : 5;

/**
 * @async
 * @function createProject
 * @description Service to create a new project
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of data is invalid
 */
export async function createProject(data) {
    const { orgId, name } = data;
    // check if organization exists
    const organization = await Organization.findOne({
        _id: orgId,
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    if (organization.projects >= MAX_PROJECTS) {
        throw new Error('Project limit reached');
    }
    // create project
    const project = await Project.create([
        {
            orgId,
            name,
        },
    ]);
    // create default environments
    const envs = await Environment.create([
        {
            orgId,
            projectId: project.id,
            name: ENVIRONMENTS.PRODUCTION,
        },
        {
            orgId,
            projectId: project.id,
            name: ENVIRONMENTS.STAGING,
        },
        {
            orgId,
            projectId: project.id,
            name: ENVIRONMENTS.DEVELOPMENT,
        },
        {
            orgId,
            projectId: project.id,
            name: ENVIRONMENTS.TESTING,
        },
    ]);
    await Promise.all([
        // add environment ids to project
        Project.updateOne(
            { _id: project.id },
            { $set: { environments: envs.map((env) => env.id) } }
        ),
        // increment project count in organization
        Organization.updateOne({ _id: orgId }, { $inc: { projects: 1 } }),
        // add project id to user
        User.updateOne(
            { _id: organization.adminId },
            {
                $push: {
                    projects: {
                        projectId: project.id,
                        isProjectAdmin: true,
                    },
                },
            }
        ),
    ]);
    return project;
}

/**
 * @async
 * @function getProject
 * @description Service to get a organization
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 */
export async function getProject(data) {
    const { orgId, projectId } = data;
    // check if organization exists
    const organization = await Organization.findOne({
        _id: orgId,
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    if (projectId) {
        const project = await Project.findOne({
            _id: projectId,
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }
    // get all projects
    const projects = await Project.find({
        orgId,
    });
    if (projects.length === 0) {
        throw new Error('No projects found');
    }
    return projects;
}

/**
 * @async
 * @function deleteProject
 * @description Service to delete a project
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 */
export async function deleteProject(data) {
    const { orgId, projectId } = data;
    // check if organization exists
    const organization = await Organization.findOne({
        _id: orgId,
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    // delete project and all environments
    await Promise.all([
        Project.deleteOne({
            _id: projectId,
            orgId,
        }),
        Environment.deleteMany({
            orgId,
            projectId,
        }),
        Organization.updateOne(
            {
                _id: orgId,
            },
            {
                $inc: { projects: -1 },
            }
        ),
        User.updateMany(
            {
                orgId: orgId,
            },
            {
                $pull: {
                    projects: {
                        projectId,
                    },
                },
            }
        ),
    ]);
    return { message: 'Project deleted successfully' };
}

/**
 * @async
 * @function updateProject
 * @description Service to update a project
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 */
export async function updateProject(data) {
    const { orgId, projectId, name } = data;
    // check if organization exists
    const organization = await Organization.findOne({
        _id: orgId,
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    // update project
    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            orgId,
        },
        { $set: { name } },
        { new: true }
    );
    if (!project) {
        throw new Error('Project not found');
    }
    project['message'] = 'Project updated successfully';
    return project;
}
