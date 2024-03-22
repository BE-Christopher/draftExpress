import * as nodeMailer from 'nodemailer';
import config from '../../config';
import Mail = require('nodemailer/lib/mailer');
import { IUserVerifyData } from './auth';

const transport = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.mailUser,
        pass: config.mailPassword
    },
    secure: false,
    tls: { rejectUnauthorized: false }
});

class MailSender {

    constructor() { }

    private transportSendmail(mailOptions: Mail.Options, logging: string) {
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                throw err;
            } else {
                console.log(logging);
            }
        });
    }

    registerNotification(userData: IUserVerifyData, verifyToken: string) {
        try {
            const mailOptions: Mail.Options = {
                from: config.mailUser,
                to: userData.email,
                subject: 'Verify your account',
                text: 'Please verify your account with this link: \n' + `${config.appDomain}${config.resetPasswordPath}?token=${verifyToken}`
            };

            this.transportSendmail(mailOptions, `Success send verification mail to ${userData.email}`);
        } catch (error) {
            throw error;
        }
    }

    resetPasswordNotification(verifyToken: string, to: string) {
        try {
            const resetPasswordApiLink = `${config.appDomain}${config.resetPasswordPath}?token=${verifyToken}`;
            const mailOptions: Mail.Options = {
                from: config.mailUser,
                to,
                subject: 'Follow to this link to reset your password',
                text: 'Please follow this link to reset your password of account\n' + resetPasswordApiLink
            };

            this.transportSendmail(mailOptions, `Success send reset password mail`);
        } catch (error) {
            throw error;
        }
    }
}

export default new MailSender();
