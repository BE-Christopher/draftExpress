import { NextFunction, Request, Response } from "express";
import responseHandler, { ErrorMessage, IErrorPayload } from "./responseHandler";
import UserDataQuery from "../../models/dataQueries/base/User.base.dataQueries";
import { BaseController } from "./base";
import { User } from "../../models/entities";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import config from "../../config";
import moment = require("moment");
import mailSender from "./mailSender";
import * as crypto from 'crypto';
import { jwtDecode, JwtPayload } from "jwt-decode";

interface IAuth { }

export type IUserVerifyData = {
    id: number,
    email: string,
    role: string;
};

const secretKey = 'e05a8d484a5a6d5ab76dbb287e09ff4d89a7d8c196fbb9c9b6d9d1a9a58d16d2';
class Auth extends BaseController implements IAuth {
    userQuery;
    errorMessage;

    constructor() {
        super();
        this.userQuery = new UserDataQuery();
        this.errorMessage = new ErrorMessage();
    }

    private jwtRenderToken(data: any) {
        const expiresIn = '3h';
        return jwt.sign(data, secretKey, { expiresIn });
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                email,
                password
            } = req.body;

            // case null email or password
            if (!email || !password) {
                this.errorResponse({
                    code: 403,
                    error: {
                        email: this.errorMessage.required(email),
                        password: this.errorMessage.required(password)
                    }
                });
            }

            const currentUser = await this.userQuery.getOne({ options: { email } });

            // case invalid user or deleted user
            if (!currentUser || currentUser.isDeleted) {
                this.errorResponse({
                    code: 403,
                    error: this.errorMessage.isDeleted(`The user with email ${email}`)
                });
            }

            //password checking
            const isMatch = await bcrypt.compare(password, String(currentUser?.password));
            if (!isMatch) {
                this.errorResponse({
                    code: 401,
                    error: 'Unauthorize'
                });
            }

            responseHandler.successHandler(res, this.jwtRenderToken(currentUser as User));
        } catch (error) {
            console.log('>>>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                email,
                password,
                personalId,
                name,
                birthDate,
                gender,
                phone,
                location,
                role
            } = req.body;

            // case invalid data
            if (!email || !password || !personalId) {
                this.errorResponse({
                    code: 400,
                    error: {
                        email: this.errorMessage.required(email),
                        password: this.errorMessage.required(password),
                        personalId: this.errorMessage.required(personalId)
                    }
                });
            }

            const existedUser = await this.userQuery.getOne({ options: { email } });
            if (existedUser) {
                this.errorResponse({
                    code: 400,
                    error: this.errorMessage.isExisted(`The user with this email ${email}`)
                });
            }

            // user data config
            const decodePassword = await bcrypt.hash(password, config.passwordSalt);
            const ageCalculate = birthDate ? moment().year() - moment(birthDate).year() : undefined;

            // save user
            const newUser = await this.userQuery.create({
                age: ageCalculate,
                birthDate,
                email,
                gender,
                locations: location,
                name,
                personalId,
                phone,
                password: decodePassword,
                role,
            });

            const verifyToken = this.jwtRenderToken({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            });

            mailSender.registerNotification(
                {
                    email,
                    id: newUser.id,
                    role: newUser.role
                },
                verifyToken
            );

            responseHandler.successHandler(res, newUser);
        } catch (error) {
            console.log('>>>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.query;
            const { newPassword } = req.body;
            // check token is null
            if (!token) {
                this.errorResponse({
                    code: 401,
                    error: this.errorMessage.required(token)
                });
            }
            const tokenData: JwtPayload = jwtDecode(String(token));
            console.log("🚀 ~ Auth ~ resetPassword ~ tokenData:", tokenData);
            // const newPasswordDecrypt = await bcrypt.hash(newPassword, config.passwordSalt);
            // await this.userQuery.update({
            //     id: Number(tokenData.),
            //     updatingData: {
            //         password: newPasswordDecrypt
            //     }
            // });
            responseHandler.successHandler(res, `Success reset password`);
        } catch (error) {
            console.log('>>>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const existedUser = await this.userQuery.getOne({ options: { email } });
            if (!existedUser) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.doesExisted(`The user with email ${email}`)
                });
            }

            const resetPasswordToken = this.jwtRenderToken({
                email: existedUser?.email,
                role: existedUser?.role,
                id: existedUser?.id
            });

            mailSender.resetPasswordNotification(resetPasswordToken, email);

            responseHandler.successHandler(res, `Success send reset mail to ${email}`);
        } catch (error) {
            console.log('>>>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export default new Auth();
