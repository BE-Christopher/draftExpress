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


const jwtRenderToken = (data: any) => {
    console.log('>>>>>>>>>>>>>>>>');

    const expiresIn = '3h';
    return jwt.sign(data, config.jwtSecretKey, { expiresIn });
};
const userQuery = new UserDataQuery();
class Auth extends BaseController implements IAuth {
    // async login(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const {
    //             email,
    //             password
    //         } = req.body;

    //         // case null email or password
    //         if (!email || !password) {
    //             this.errorResponse({
    //                 code: 403,
    //                 error: {
    //                     email: this.errorMessage.required(email),
    //                     password: this.errorMessage.required(password)
    //                 }
    //             });
    //         }

    //         const currentUser = await this.userQuery.getOne({ options: { email } });

    //         // case invalid user or deleted user
    //         if (!currentUser || currentUser.isDeleted) {
    //             this.errorResponse({
    //                 code: 403,
    //                 error: this.errorMessage.isDeleted(`The user with email ${email}`)
    //             });
    //         }

    //         //password checking
    //         const isMatch = await bcrypt.compare(password, String(currentUser?.password));
    //         if (!isMatch) {
    //             this.errorResponse({
    //                 code: 401,
    //                 error: 'Unauthorize'
    //             });
    //         }

    //         responseHandler.successHandler(res, this.jwtRenderToken(currentUser as User));
    //     } catch (error) {
    //         console.log('>>>>>>>>>>>>>>>', error);
    //         responseHandler.errorHandler(res, error);
    //     }
    // }

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

            const existedUser = await userQuery.getOne({ options: { email } });
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
            const newUser = await userQuery.create({
                age: ageCalculate,
                birthDate: new Date(birthDate),
                email,
                gender,
                locations: location,
                name,
                personalId,
                phone,
                password: decodePassword,
                role,
            });

            const verifyToken = jwtRenderToken({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            });

            console.log("🚀 ~ Auth ~ register ~ verifyToken:", verifyToken);
            await mailSender.registerNotification(
                {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role
                },
                verifyToken
            );

            responseHandler.successHandler(res, {});
        } catch (error) {
            console.log('>>>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async verifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.query;
            // authenticated token
            const verifiedToken: any = await jwt.verify(String(token), config.jwtSecretKey);
            if (!verifiedToken) {
                this.errorResponse({
                    code: 401,
                    error: 'Unauthorize'
                });
            }

            // update user verified flag
            await userQuery.update({
                id: Number(verifiedToken.id),
                updatingData: {
                    isVerified: true
                }
            });

            responseHandler.successHandler(res, `Your profile has success verified`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    // async resetPassword(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { token } = req.query;
    //         const { newPassword } = req.body;
    //         // check token is null
    //         if (!token) {
    //             this.errorResponse({
    //                 code: 401,
    //                 error: this.errorMessage.required(token)
    //             });
    //         }
    //         const tokenData: JwtPayload = jwtDecode(String(token));
    //         console.log("🚀 ~ Auth ~ resetPassword ~ tokenData:", tokenData);
    //         // const newPasswordDecrypt = await bcrypt.hash(newPassword, config.passwordSalt);
    //         // await this.userQuery.update({
    //         //     id: Number(tokenData.),
    //         //     updatingData: {
    //         //         password: newPasswordDecrypt
    //         //     }
    //         // });
    //         responseHandler.successHandler(res, `Success reset password`);
    //     } catch (error) {
    //         console.log('>>>>>>>>>>>>>>>', error);
    //         responseHandler.errorHandler(res, error);
    //     }
    // }

    // async forgotPassword(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { email } = req.body;
    //         const existedUser = await this.userQuery.getOne({ options: { email } });
    //         if (!existedUser) {
    //             this.errorResponse({
    //                 code: 404,
    //                 error: this.errorMessage.doesExisted(`The user with email ${email}`)
    //             });
    //         }

    //         const resetPasswordToken = this.jwtRenderToken({
    //             email: existedUser?.email,
    //             role: existedUser?.role,
    //             id: existedUser?.id
    //         });

    //         mailSender.resetPasswordNotification(resetPasswordToken, email);

    //         responseHandler.successHandler(res, `Success send reset mail to ${email}`);
    //     } catch (error) {
    //         console.log('>>>>>>>>>>>>>>>', error);
    //         responseHandler.errorHandler(res, error);
    //     }
    // }
}

export const auth = new Auth();
