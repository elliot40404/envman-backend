import { Schema } from 'mongoose';

export const ORGANIZATION_STATUS = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    TRIAL: 'trial',
});

export const schema = new Schema(
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(ORGANIZATION_STATUS),
            default: ORGANIZATION_STATUS.TRIAL,
        },
        members: {
            type: Number,
            default: 1,
            max: 5,
            min: 1,
        },
        projects: {
            type: Number,
            default: 0,
            max: 5,
            min: 0,
        },
    },
    {
        collection: 'organizations',
        timestamps: true,
    }
);
