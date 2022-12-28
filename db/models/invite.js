import { Schema } from 'mongoose';

export const schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        accepted: {
            type: Boolean,
            default: false,
        },
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            index: true,
        },
        isAccountAdmin: {
            type: Boolean,
            default: false,
        },
        expireAt: {
            type: Date,
            default: Date.now,
            expires: '1d',
        },
    },
    {
        collection: 'invites',
        timestamps: true,
    }
);
