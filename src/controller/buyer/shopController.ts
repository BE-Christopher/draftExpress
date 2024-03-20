import { ShopBaseController } from "../base/shop";
import { buyerShopDataQuery } from '../../models/dataQueries/buyer';
import { NextFunction, Request, Response } from "express";
import responseHandler from "../base/responseHandler";
import UserBuyerDataQueries from "../../models/dataQueries/buyer/User.buyer.dataQueries";
import { EShopStatus, EUserRole } from "../../interfaces";
import * as blueBirdPromise from 'bluebird';

type IndustryUpdatingData = {
    id: number,
    data?: any;
};

class BuyerShopController extends ShopBaseController {
    shopQuery = buyerShopDataQuery;

    constructor() {
        super();
    }

    // WIP
    async updateMyStore(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                id,
                description,
                name,
                industries
            } = req.body;
            const currentUser = req?.user as any;

            const currentStore = await this.shopQuery.getOneById(id);
            // check store
            if (!currentStore) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.doesExisted(`The store with id: ${id}`)
                });
            }
            if (currentStore?.author.id !== Number(currentUser?.id)) {
                this.errorResponse({
                    code: 401,
                    error: 'Unauthorize'
                });
            }

            // update general shop data
            await this.shopQuery.updateMyShop(id, {
                description,
                name,
            });

            // update shop industries
            if (industries) {
                const {
                    industryUpdate,
                    industryDelete
                } = industries;

                Array(industryUpdate).length && await blueBirdPromise.mapSeries(industryUpdate as IndustryUpdatingData[], async (item) => {
                    await this.shopQuery.updateMyShop(Number(item?.id), item?.data);
                });
                // will write late
                // Array(industryDelete).length && await blueBirdPromise.mapSeries(industryDelete as IndustryUpdatingData, async (item) => {
                //     // await
                // })
            }

            // update shop asserts
            // will writing late

            responseHandler.successHandler(res, {});
        } catch (error) {
            console.log('><>>>>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async closeOrDisableShop(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, type } = req.body;

            // check type
            if (!(String(type) in EShopStatus)) {
                this.errorResponse({
                    code: 400,
                    error: this.errorMessage.required(type)
                });
            }
            // check user and role
            const currentUser = UserBuyerDataQueries.getOne({ options: { id: Number(id), isDeleted: false, isVerified: true, role: EUserRole.Buyer } });
            if (!currentUser) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.invalidRole(`The user with id: ${id}`)
                });
            }

            // handler update
            if (String(type) === EShopStatus.Pause) {
                await this.shopQuery.disableMyShop(id);
            } else {
                await this.shopQuery.closeMyShop(id);
            }

            responseHandler.successHandler(res, `Success ${type} your store`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export default new BuyerShopController();
