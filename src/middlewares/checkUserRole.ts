import { NextFunction, Request, Response } from "express";
import responseHandler from "../controller/base/responseHandler";
import { User } from "../models/entities";
import { EUserRole } from "../interfaces";

class CheckUserRole {
    isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const isAdmin = (req.user as User).role === EUserRole.Admin;
            if (isAdmin) {
                next();
            } else {
                responseHandler.errorHandler(res, {
                    code: 401,
                    message: 'Unauthorize'
                });
            }
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    isBuyer(req: Request, res: Response, next: NextFunction) {
        try {
            const isAdmin = (req.user as User).role === EUserRole.Buyer;
            if (isAdmin) {
                next();
            } else {
                responseHandler.errorHandler(res, {
                    code: 401,
                    message: 'Unauthorize'
                });
            }
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    isUser(req: Request, res: Response, next: NextFunction) {
        try {
            const isAdmin = (req.user as User).role === EUserRole.User;
            if (isAdmin) {
                next();
            } else {
                responseHandler.errorHandler(res, {
                    code: 401,
                    message: 'Unauthorize'
                });
            }
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export default new CheckUserRole();
