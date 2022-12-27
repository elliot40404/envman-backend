import { Organization, User, Project, Environment } from '../db/db.js';
import { ENVIRONMENTS } from '../db/models/environment.js';
import 'dotenv/config';
import { ROLES } from '../db/models/project.js';

const MAX_PROJECTS = process.env.MAX_PROJECTS
    ? parseInt(process.env.MAX_PROJECTS)
    : 5;

// NOTE: as of now there is no accountAdmin only superAdmin

/**
 * @async
 * @function createProject
 * @description Service to create a new project
 * @param {object} data - The account data
 * @param {string} data.orgId - The organization id
 * @param {string} data.name - The project name
 * @param {string} data.userId - The user id
 * @returns {Promise<object>}
 * @throws {Error} - If either of data is invalid
 */
export async function createProject(data) {
    const { orgId, name, userId } = data;
    // check if organization exists
    const [organization, user] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
    ]);
    if (!organization || !user) {
        throw new Error('Organization or user not found');
    }
    if (organization.projects >= MAX_PROJECTS) {
        throw new Error('Project limit reached');
    }
    // check if user is admin
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('User is not authorized to create a project');
    }
    // check if project name is unique
    const projectExists = await Project.findOne({
        orgId,
        name,
    });
    if (projectExists) {
        throw new Error('Project name already exists');
    }
    // create project
    // NOTE: assumes no accountAdmins and adds superAdmin as admin
    const project = await Project.create({
        orgId,
        name,
        permissions: [
            {
                userId: organization.adminId,
                role: ROLES.ADMIN,
                environments: [ENVIRONMENTS.ALL],
            },
        ],
    });
    await Promise.all([
        // create default environments
        Environment.create([
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
        ]),
        // increment project count in organization
        Organization.updateOne({ _id: orgId }, { $inc: { projects: 1 } }),
        // add project id to user
        User.updateOne(
            { _id: organization.adminId },
            {
                $push: {
                    projects: project.id,
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
    const { orgId, projectId, userId } = data;
    // check if organization exists
    const [organization, user] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
    ]);
    if (!organization || !user) {
        throw new Error('Organization or user not found');
    }
    // if project id provided
    if (projectId) {
        // check if user has access to project
        if (!user.projects.includes(projectId)) {
            // NOTE: this is also thrown if project does not exist as project id is not validated
            throw new Error('User does not have access to project');
        }
        const project = await Project.findOne({
            _id: projectId,
            orgId,
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }
    // get all projects
    const projects = await Project.find({
        orgId,
        _id: {
            $in: user.projects,
        },
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
    const { orgId, projectId, userId } = data;
    // check if organization exists
    const [organization, user] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
    ]);
    if (!organization || !user) {
        throw new Error('Organization or user not found');
    }
    // check if user is admin
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('User is not authorized to delete a project');
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
                projects: { $gt: 0 },
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
                    projects: projectId,
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
    const { orgId, projectId, name, userId } = data;
    // check if organization exists
    const [organization, user] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
    ]);
    if (!organization || !user) {
        throw new Error('Organization or user not found');
    }
    // check if user is admin
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('User is not authorized to update a project');
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

/**
 * @async
 * @function addUser
 * @description Service to add a user to a project
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 * @throws {Error} - If user is already in project
 */
export async function addUser(data) {
    const { orgId, projectId, userId, addId, role, envs } = data;
    // check if organization exists
    const [organization, project, user, add] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        Project.findOne({
            _id: projectId,
            orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
        User.findOne({
            _id: addId,
            orgId,
        }),
    ]);
    if (!organization || !project || !user || !add) {
        throw new Error(
            'Organization, project, user or id to be add is not found'
        );
    }
    // TODO: in future, project admins should be able to add users to project
    // check if user is superAdmin or accountAdmin
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('User is not authorized to add user to project');
    }
    // check if user is already in project
    if (add.projects.includes(projectId)) {
        throw new Error('User already in project');
    }
    await Promise.all([
        // add user to project
        Project.updateOne(
            {
                _id: projectId,
                orgId,
            },
            {
                $push: {
                    permissions: {
                        userId: addId,
                        role: role || ROLES.VIEWER,
                        environments:
                            envs.length > 0 ? envs : [ENVIRONMENTS.TESTING],
                    },
                },
            }
        ),
        // add project to user
        User.updateOne(
            {
                _id: addId,
            },
            {
                $push: {
                    projects: projectId,
                },
            }
        ),
    ]);
    return {
        message: 'User added to project successfully',
    };
}

/**
 * @async
 * @function removeUser
 * @description Service to remove a user from a project
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 * @throws {Error} - If user is not in project
 * @throws {Error} - If user is admin of project
 * @throws {Error} - If user is admin of organization
 */
export async function removeUser(data) {
    const { orgId, projectId, userId, removeId } = data;
    if (userId === removeId) {
        throw new Error('Cannot remove self from project');
    }
    // check if organization exists
    const [organization, project, user, rId] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        Project.findOne({
            _id: projectId,
            orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
        User.findOne({
            _id: removeId,
            orgId,
        }),
    ]);
    if (!organization || !project || !user || !rId) {
        throw new Error('Organization, project, user or removeId not found');
    }
    // check if user is Account Admin or Super Admin
    if (!user.isAccountAdmin && !user.isSuperAdmin) {
        throw new Error('User is not authorized to perform this action');
    }
    // check if last user in project
    if (project.permissions.length === 1) {
        throw new Error('Cannot remove last user from project');
    }
    // check if user to be removed is superAdmin
    // TODO: in future, project admins should be able to remove users from project but not superAdmin/AccountAdmin
    if (rId.isSuperAdmin) {
        throw new Error('Cannot remove super admin from project');
    }
    await Promise.all([
        // remove user from project
        Project.updateOne(
            {
                _id: projectId,
                orgId,
            },
            {
                $pull: {
                    permissions: {
                        userId: removeId,
                    },
                },
            }
        ),
        // remove project from user
        User.updateOne(
            {
                _id: removeId,
            },
            {
                $pull: {
                    projects: projectId,
                },
            }
        ),
    ]);
    return {
        message: 'User removed from project successfully',
    };
}

/**
 * @async
 * @function modUserRole
 * @description Service to modify a user's role in a project
 * @param {object} data - The account data
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 * @throws {Error} - If user is not in project
 */
export async function modUserRole(data) {
    const { orgId, projectId, userId, modifyId, role } = data;
    // check if orgId and modifyId are same
    if (userId === modifyId) {
        throw new Error('Cannot modify self role');
    }
    // check if organization exists
    const [organization, project, user, mId] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        Project.findOne({
            _id: projectId,
            orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
        User.findOne({
            _id: modifyId,
            orgId,
        }),
    ]);
    if (!organization || !project || !user || !mId) {
        throw new Error('Organization, project, user or modifyId not found');
    }
    // check if user is project admin
    const projectEnv = project.permissions.find(
        (p) => p.userId.toString() === userId
    );
    if (!projectEnv) {
        throw new Error('User is not in project');
    }
    if (projectEnv.role !== ROLES.ADMIN) {
        throw new Error('User is not authorized to perform this action');
    }
    await Project.updateOne(
        {
            _id: projectId,
            orgId,
            'permissions.userId': modifyId,
        },
        {
            $set: {
                'permissions.$.role': role,
            },
        }
    );
    return {
        message: 'User role modified successfully',
    };
}

/**
 * @async
 * @function addEnvironment
 * @description Service to add environment to a user in a project
 * @param {object} data - The account data
 * @param {boolean} remove - If true, remove environment from user
 * @returns {Promise<object>}
 * @throws {Error} - If either of the id's are invalid
 * @throws {Error} - If user is not in project
 */
export async function modEnvironment(data, remove = false) {
    const { orgId, projectId, userId, modifyId, envs, env } = data;
    // check if organization exists
    const [organization, project, user, mId] = await Promise.all([
        Organization.findOne({
            _id: orgId,
        }),
        Project.findOne({
            _id: projectId,
            orgId,
        }),
        User.findOne({
            _id: userId,
            orgId,
        }),
        User.findOne({
            _id: modifyId,
            orgId,
        }),
    ]);
    if (!organization || !project || !user || !mId) {
        throw new Error('Organization, project, user or addId not found');
    }
    // check if user is project admin
    const userEnv = project.permissions.find(
        (p) => p.userId.toString() === userId
    );
    if (!userEnv) {
        throw new Error('User is not in project');
    }
    // check if user is project admin
    if (userEnv.role !== ROLES.ADMIN) {
        throw new Error('User is not authorized to perform this action');
    }
    let updateQuery = {};
    if (remove) {
        if (env) {
            updateQuery = {
                $pull: {
                    'permissions.$.environments': env,
                },
            };
        } else {
            updateQuery = {
                $pull: {
                    'permissions.$.environments': {
                        $in: envs,
                    },
                },
            };
        }
    } else {
        if (env) {
            updateQuery = {
                $addToSet: {
                    'permissions.$.environments': env,
                },
            };
        } else {
            updateQuery = {
                $addToSet: {
                    'permissions.$.environments': {
                        $each: envs,
                    },
                },
            };
        }
    }
    await Project.updateOne(
        {
            _id: projectId,
            orgId,
            'permissions.userId': modifyId,
        },
        updateQuery
    );
    return {
        message: 'Environment permissions modified successfully',
    };
}
