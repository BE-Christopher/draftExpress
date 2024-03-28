import * as dotenv from 'dotenv';

export interface AppConfig {
    dbUsername: string;
    dbPassword: string;
    dbBase: string;
    dbPort: number;
    dbHost: string;
    passportSecretKey: string;
    passwordSalt: number;
    mailUser: string;
    mailPassword: string;
    appDomain: string
    resetPasswordPath: string,
    jwtSecretKey: string
}

const checkConfiguration = () => {
    dotenv.config();
    try {
        const {
            DB_USERNAME,
            DB_PASSWORD,
            DB_BASE,
            DB_PORT,
            DB_HOST,
            PASSPORT_SECRET_KEY,
            PASSWORD_SALT,
            MAIL_USER,
            MAIL_PASSWORD,
            DOMAIN,
            RESET_PASSWORD,
            JWT_SECRET_KEY
        } = process.env;
        if (
            !DB_USERNAME ||
            !DB_PASSWORD ||
            !DB_BASE ||
            !DB_HOST ||
            !DB_PORT ||
            !PASSPORT_SECRET_KEY ||
            !PASSWORD_SALT ||
            !MAIL_PASSWORD ||
            !DOMAIN ||
            !RESET_PASSWORD ||
            !MAIL_USER || 
            !JWT_SECRET_KEY
        ) {
            throw new Error('Configuration missing fields');
        }
    } catch (error) {
        throw error;
    }
};

const configuration = () => {
    checkConfiguration();
    const configuration: AppConfig = {
        dbBase: String(process.env.DB_BASE),
        dbHost: String(process.env.DB_HOST),
        dbPassword: String(process.env.DB_PASSWORD),
        dbPort: Number(process.env.DB_PORT),
        dbUsername: String(process.env.DB_USERNAME),
        passportSecretKey: String(process.env.PASSPORT_SECRET_KEY),
        passwordSalt: Number(process.env.PASSWORD_SALT),
        mailPassword: String(process.env.MAIL_PASSWORD),
        appDomain: String(process.env.DOMAIN),
        resetPasswordPath: String(process.env.RESET_PASSWORD),
        mailUser: String(process.env.MAIL_USER),
        jwtSecretKey: String(process.env.JWT_SECRET_KEY),
    };
    return configuration;
};

export default configuration();
