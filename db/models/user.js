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
            ref: 'Organization',
            index: true,
        },
        firebaseUid: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
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
        projects: {
            type: [Schema.Types.ObjectId],
            ref: 'Project',
            index: true,
            default: [],
        },
    },
    {
        collection: 'users',
        timestamps: true,
    }
);
