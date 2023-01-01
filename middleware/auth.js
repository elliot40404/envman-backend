import 'dotenv/config';
import { validateToken } from '../helpers/firebase.js';

if (process.env.NODE_ENV === 'development') {
    console.log('USING DEVELOPMENT TOKEN');
} else {
    console.log('USING FIREBASE TOKEN');
}

const auth = async (req, res, next) => {
    const Authorization = req.headers.authorization;
    if (!Authorization) {
        return res.status(401).send('Unauthorized');
    }
    const [, token] = Authorization.split(' ');
    try {
        if (!token) {
            return res.status(401).send('Unauthorized');
        }
        if (process.env.NODE_ENV === 'development') {
            if (token !== process.env.API_TOKEN) {
                return res.status(401).send('Unauthorized');
            }
        } else {
            const decodedToken = await validateToken(token);
            if (!decodedToken) {
                return res.status(401).send('Unauthorized');
            }
            req.user = decodedToken;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send('Invalid token');
    }
};

export default auth;
