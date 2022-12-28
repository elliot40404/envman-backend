import nodemailer from 'nodemailer';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inviteTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/invite.html'),
    'utf8'
);
const confirmTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/confirm.html'),
    'utf8'
);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * @async
 * @function sendEmail
 * @param {string} to - email address
 * @param {string} subject - email subject
 * @param {string} html - email body
 * @returns {Promise<string>}
 */
export const sendEmail = async (to, subject, html) => {
    return new Promise(async (resolve, reject) => {
        try {
            const email = await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: to,
                subject: subject,
                html: html,
            });
            console.log('Message sent: %s', email.messageId);
            resolve(email.messageId);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * @enum {function}
 * @readonly
 * @property {function} confirmEmail - email template for verify email
 * @property {function} inviteEmail - email template for invite email
 * @property {function} resetPassword - email template for reset password
 * @property {function} changeEmail - email template for change email
 * @property {function} changePassword - email template for change password
 */
export const emailTemplates = Object.freeze({
    confirmEmail: (verifyUri) => {
        return confirmTemplate.replaceAll('{{verifyUri}}', verifyUri);
    },
    inviteEmail: (orgName, inviteUri) => {
        return inviteTemplate
            .replaceAll('{{orgName}}', orgName)
            .replaceAll('{{inviteUri}}', inviteUri);
    },
});

/**
 * @enum {string}
 * @readonly
 * @property {string} verifyEmail - email subject for verify email
 * @property {string} inviteEmail - email subject for invite email
 * @property {string} resetPassword - email subject for reset password
 * @property {string} changeEmail - email subject for change email
 * @property {string} changePassword - email subject for change password
 */
export const emailSubject = Object.freeze({
    verifyEmail: 'Verify your email address',
    inviteEmail: 'You have been invited to join a workspace',
    resetPassword: 'Reset your password',
    changeEmail: 'Request for email address change',
    changePassword: 'Request for password change',
});
