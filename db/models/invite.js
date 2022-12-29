import { Schema } from 'mongoose';
import 'dotenv/config';

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
    },
    {
        collection: 'invites',
        timestamps: true,
    }
);

const eat = parseInt(process.env.INVITE_EXPIRATION) || 12 * 60 * 60;

schema.index({ createdAt: 1 }, { expireAfterSeconds: eat });