import { NextFunction, Request, Response } from "express";
import { EShopStatus, EUserRole } from "../../interfaces";
import ShopUserDataQueries from "../../models/dataQueries/user/Shop.user.dataQueries";
import UserUserDataQueries from "../../models/dataQueries/user/User.user.dataQueries";
import responseHandler from "../base/responseHandler";
import { ShopBaseController } from "../base/shop";
import { User } from "../../models/entities";

const shopQuery = ShopUserDataQueries;

class UserShopController extends ShopBaseController {
    constructor() {
        super();
    }

    async registerMyShop(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                description
            } = req.body;

            // check user
            const currentUser = req.user as User;
            const errorContent = `This user with id: ${currentUser.id}`;
            if (!currentUser) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.doesExisted(errorContent)
                });
            }
            if (currentUser?.role !== EUserRole.User) {
                this.errorResponse({
                    code: 400,
                    error: this.errorMessage.invalidRole(errorContent)
                });
            }

            // update user and role
            const updatingUserRole = UserUserDataQueries.update({
                id: Number(currentUser?.id),
                updatingData: {
                    role: EUserRole.Buyer,
                }
            });

            // create shop
            const creatingShop = shopQuery.registerMyShop({
                author: currentUser as User,
                description,
                name,
                status: EShopStatus.Active,
            });

            await Promise.all([
                updatingUserRole,
                creatingShop
            ]);

            responseHandler.successHandler(res, `Success init your shop`);
        } catch (error) {
            console.log('<>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const userShopController = new UserShopController();
