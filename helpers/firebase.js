import 'dotenv/config';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp();
export const auth = getAuth(app);

// validate the firebase token
export const validateToken = async (token) => {
    if (!token) {
        throw new Error('No token provided');
    }

    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
};
