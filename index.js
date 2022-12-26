// -- IMPORTS --
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import organizationRoutes from './router/v1/organization.routes.js';
import projectRoutes from './router/v1/project.routes.js';
import userRoutes from './router/v1/user.routes.js';
import environmentRoutes from './router/v1/environment.routes.js';
import { defaultErrorHandler } from './middleware/errorHandler.js';
import auth from './middleware/auth.js';

// -- CONFIG --
// file deepcode ignore UseCsurfForExpress: <Defeats purpose of rest api>
const app = express();
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false, limit: '150mb' }));
app.use(express.json());
app.enable('trust proxy');
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false, // cors
        dnsPrefetchControl: false,
        frameguard: false,
        expectCt: false,
        hsts: false,
        ieNoOpen: false,
        noSniff: false,
        originAgentCluster: false,
        permittedCrossDomainPolicies: false,
        referrerPolicy: true,
        xssFilter: false,
    })
);
app.use(
    morgan(
        ':remote-addr :remote-user :date[clf] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms :total-time ms'
    )
);
app.use(
    cors({
        origin: process.env.CORS_ORIGIN.split(','),
    })
);

// TODO: add rate limiter
// TODO: make users login with username and password (firebase or something)

// -- ROUTES --
app.use('/api/v1/organization', auth, organizationRoutes);
app.use('/api/v1/project', auth, projectRoutes);
app.use('/api/v1/user', auth, userRoutes);
app.use('/api/v1/environment', auth, environmentRoutes);

// -- health check route --
app.get('/ping', async (_req, res) => {
    res.send('pong');
});
// -- token check route --
app.get('/api/token', auth, async (_req, res) => {
    res.send('token valid');
});

// -- catch all route --
app.use('*', (_req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
});

// -- Error handler middleware --
app.use(defaultErrorHandler);

const PORT = process.env.API_PORT || 4000;
const URI = process.env.API_URL || 'http://localhost:4000';
const server = app.listen(PORT, () => {
    console.info('SERVER INFO:', `Server started w/ pid ${process.pid}`);
    console.info('SERVER INFO:', `Listening on ${URI}`);
    console.info('SERVER INFO:', `Environment: ${process.env.NODE_ENV}`);
    console.info('SERVER INFO:', `CORS:`);
    console.info(process.env.CORS_ORIGIN.split(','));
});

process.on('SIGTERM', () => {
    console.info(
        'Got SIGTERM. Graceful shutdown initiated',
        new Date().toISOString()
    );
    server.close(() => {
        console.info('Process terminated w/ SIGTERM');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info(
        'Got SIGINT. Graceful shutdown initiated',
        new Date().toISOString()
    );
    server.close(() => {
        console.info('Process interrupted w/ SIGINT');
        process.exit(0);
    });
});
