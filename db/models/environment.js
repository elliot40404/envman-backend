import { Schema } from 'mongoose';

export const ENVIRONMENTS = Object.freeze({
    PRODUCTION: 'production',
    STAGING: 'staging',
    DEVELOPMENT: 'development',
    TESTING: 'testing',
});

export const schema = new Schema(
    {
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'organizations',
            required: true,
            index: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'projects',
            required: true,
            index: true,
        },
        name: {
            type: String,
            enum: Object.values(ENVIRONMENTS),
            required: true,
        },
        variables: {
            type: [
                {
                    key: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
    },
    {
        collection: 'environments',
        timestamps: true,
    }
);
