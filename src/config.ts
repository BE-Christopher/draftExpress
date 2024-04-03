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
    appDomain: string;
    resetPasswordPath: string,
    jwtSecretKey: string,
    socketPort: number;
    socketDomain: string;
    clientId: string;
    apiKey: string;
    checkCardPath: string;
    adminBankBin: string;
    adminBankAccount: string;
    adminBankName: string;
    generateQrPath: string;
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
            JWT_SECRET_KEY,
            SOCKET_PORT,
            SOCKET_DOMAIN,
            CLIENT_ID,
            API_KEY,
            CHECK_CARD_PATH,
            ADMIN_BANK_BIN,
            ADMIN_BANK_ACCOUNT,
            ADMIN_BANK_NAME,
            GENERATE_QR_PATH
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
            !JWT_SECRET_KEY ||
            !SOCKET_PORT ||
            !SOCKET_DOMAIN ||
            !CLIENT_ID ||
            !API_KEY ||
            !CHECK_CARD_PATH ||
            !ADMIN_BANK_BIN ||
            !ADMIN_BANK_ACCOUNT ||
            !ADMIN_BANK_NAME ||
            !GENERATE_QR_PATH
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
        socketPort: Number(process.env.SOCKET_PORT),
        socketDomain: String(process.env.SOCKET_DOMAIN),
        clientId: String(process.env.CLIENT_ID),
        apiKey: String(process.env.API_KEY),
        checkCardPath: String(process.env.CHECK_CARD_PATH),
        adminBankAccount: String(process.env.ADMIN_BANK_ACCOUNT),
        adminBankBin: String(process.env.ADMIN_BANK_BIN),
        adminBankName: String(process.env.ADMIN_BANK_NAME),
        generateQrPath: String(process.env.GENERATE_QR_PATH)
    };
    return configuration;
};

export default configuration();
