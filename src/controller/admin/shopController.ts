import { NextFunction, Request, Response } from "express";
import { adminShopDataQuery } from "../../models/dataQueries/admin/index";
import { ShopBaseController } from "../base/shop";
import responseHandler from "../base/responseHandler";

export enum AdminDeleteShop {
    Delete = 'Delete',
    Disable = 'Disable'
}

class AdminShopController extends ShopBaseController {
    shopQuery = adminShopDataQuery;

    async disableOrHardDeleteShop(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                id,
                type
            } = req.body;

            if (!(String(type) in AdminDeleteShop)) {
                this.errorResponse({
                    code: 400,
                    error: 'Invalid delete type value'
                });
            }

            if (String(type) === AdminDeleteShop.Disable) {
                await this.shopQuery.disableShop(id);
            } else {
                await this.shopQuery.hardDelete(id);
            }

            responseHandler.successHandler(res, `Success ${type} this shop`);
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export default new AdminShopController();
