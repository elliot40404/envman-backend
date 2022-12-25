import 'dotenv/config';

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
        if (token !== process.env.API_TOKEN) {
            return res.status(401).send('Unauthorized');
        }
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
};

export default auth;
