import { NextFunction, Request, Response } from "express";
import { EUserRole } from "../../interfaces";
import ShopUserDataQueries from "../../models/dataQueries/user/Shop.user.dataQueries";
import UserUserDataQueries from "../../models/dataQueries/user/User.user.dataQueries";
import responseHandler from "../base/responseHandler";
import { ShopBaseController } from "../base/shop";


class UserShopController extends ShopBaseController {
    shopQuery = ShopUserDataQueries;
    constructor() {
        super();
    }

    async registerMyShop(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body;
            const errorContent = `This user with id: ${id}`;

            // check user
            const currentUser = await UserUserDataQueries.getOne({ options: { id, isDeleted: false, isVerified: true } });
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
                id,
                updatingData: {
                    role: EUserRole.Buyer,
                }
            });
            const creatingShop = this.shopQuery.registerMyShop(id);

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
