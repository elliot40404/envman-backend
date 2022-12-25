import { Schema } from 'mongoose';

export const schema = new Schema(
    {
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'organizations',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        environments: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
    },
    {
        collection: 'projects',
        timestamps: true,
    }
);
