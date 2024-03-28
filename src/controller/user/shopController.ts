import { NextFunction, Request, Response } from "express";
import { EShopStatus, EUserRole } from "../../interfaces";
import ShopUserDataQueries from "../../models/dataQueries/user/Shop.user.dataQueries";
import UserUserDataQueries from "../../models/dataQueries/user/User.user.dataQueries";
import responseHandler from "../base/responseHandler";
import { ShopBaseController } from "../base/shop";
import { Shop, User } from "../../models/entities";

const shopQuery = ShopUserDataQueries;
const userQuery = UserUserDataQueries;

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

    async followingShop(req: Request, res: Response, next: NextFunction) {
        try {
            const { shopId } = req.params;

            const existedShop = await shopQuery.getOneById(Number(shopId));
            if (!existedShop) {
                this.errorResponse({
                    code: 404,
                    error: `Shop with id: ${shopId}, doesn't existed`
                });
            }

            // update
            userQuery.addShopFollow(existedShop as Shop, Number((req.user as User).id));

            responseHandler.successHandler(res, `Success follow this shop with id: ${shopId}`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async unFollowShop(req: Request, res: Response, next: NextFunction) {
        try {
            const { shopRemoving } = req.body;

            await userQuery.removeShopFollow((req.user as User).id, shopRemoving);

            responseHandler.successHandler(res, `Success un-follow all shops`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getListShopFollowing(req: Request, res: Response, next: NextFunction) {
        try {
            const id = (req.user as User).id;

            const result = await userQuery.getListShopFollowing(Number(id));

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const userShopController = new UserShopController();
