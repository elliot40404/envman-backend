import { Schema } from 'mongoose';

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
        projectAdmins: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            index: true,
            default: [],
        },
        projectUsers: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            index: true,
            default: [],
        },
        projectViewers: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            index: true,
            default: [],
        },
    },
    {
        collection: 'projects',
        timestamps: true,
    }
);
