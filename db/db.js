import mongoose from 'mongoose';
import 'dotenv/config';
import * as organization from './models/organization.js';
import * as user from './models/user.js';
import * as environment from './models/environment.js';
import * as project from './models/project.js';

const uri = process.env.MONGO_URL;
const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

export const db = mongoose.createConnection(uri, opts, (err) => {
    if (err) {
        console.error('DB ERROR:', err);
    } else {
        console.log('DB INFO:', 'Connected to database');
    }
});

db.on('error', (err) => {
    console.error('DB ERROR:', err);
});

export const Organization = db.model('Organization', organization.schema);
export const User = db.model('User', user.schema);
export const Environment = db.model('Environment', environment.schema);
export const Project = db.model('Project', project.schema);

// TODO: mongodb requires replica set for transactions