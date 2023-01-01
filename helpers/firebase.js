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

/**
 * @async
 * @function deleteFirebaseUser
 * @param {string} uid
 * @returns {Promise<void>}
 */
export const deleteFirebaseUser = async (uid) => {
    return await auth.deleteUser(uid);
};
