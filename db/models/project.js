import { Schema } from 'mongoose';
import { ENVIRONMENTS } from './environment.js';

export const ROLES = Object.freeze({
    VIEWER: 'viewer',
    EDITOR: 'editor',
    ADMIN: 'admin',
});

export const schema = new Schema(
    {
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        permissions: {
            type: [
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    role: {
                        type: String,
                        enum: Object.values(ROLES),
                        default: ROLES.VIEWER,
                    },
                    environments: {
                        type: [String],
                        enum: Object.values(ENVIRONMENTS),
                        default: [ENVIRONMENTS.TESTING],
                    },
                },
            ],
            default: [],
        },
    },
    {
        collection: 'projects',
        timestamps: true,
    }
);
