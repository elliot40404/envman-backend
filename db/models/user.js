import { Schema } from 'mongoose';

export const schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'organizations',
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        isSuperAdmin: {
            type: Boolean,
            default: false,
        },
        isAccountAdmin: {
            type: Boolean,
            default: false,
        },
        projects: [
            {
                projectId: Schema.Types.ObjectId,
                isProjectAdmin: {
                    type: Boolean,
                    default: false,
                },
                isProjectEditor: {
                    type: Boolean,
                    default: false,
                },
                isProjectViewer: {
                    type: Boolean,
                    default: false,
                },
                environments: {
                    type: [Schema.Types.ObjectId],
                    default: [],
                },
            },
        ],
    },
    {
        collection: 'users',
        timestamps: true,
    }
);
