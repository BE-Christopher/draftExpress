import { ShopBaseController } from "../base/shop";
import { buyerIndustryDataQuery, buyerShopDataQuery } from '../../models/dataQueries/buyer';
import { NextFunction, Request, Response } from "express";
import responseHandler from "../base/responseHandler";
import UserBuyerDataQueries from "../../models/dataQueries/buyer/User.buyer.dataQueries";
import { EShopStatus, EUserRole } from "../../interfaces";
import * as blueBirdPromise from 'bluebird';
import { Industry } from "../../models/entities";

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
            const { id } = req.params;
            const {
                description,
                name,
                industries
            } = req.body;
            const currentUser = req?.user as any;

            const currentStore = await this.shopQuery.getOneById(Number(id));
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
            await this.shopQuery.updateMyShop(Number(id), {
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
            const { type } = req.body;
            const { id } = req.params
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
                await this.shopQuery.disableMyShop(Number(id));
            } else {
                await this.shopQuery.closeMyShop(Number(id));
            }

            responseHandler.successHandler(res, `Success ${type} your store`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async importNewIndustry(req: Request, res: Response, next: NextFunction) {
        try {
            const { shopId, industryId } = req.body;

            const importingIndustry = await buyerIndustryDataQuery.getOne({ id: Number(industryId) });
            // check is existed industry
            if (!importingIndustry) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.isExisted(`The Industry with id: ${industryId}`)
                });
            }

            await this.shopQuery.addNewIndustryForMyStore(Number(shopId), importingIndustry as Industry);

            responseHandler.successHandler(res, `Success add new industry with id: ${industryId} into your store`);
        } catch (error) {
            console.log('>>>>>>>>>');
            responseHandler.errorHandler(res, error);
        }
    }

    async removeNewIndustry(req: Request, res: Response, next: NextFunction) {
        try {
            const { shopId, industries } = req.body;

            await this.shopQuery.removeIndustries(industries, Number(shopId));

            responseHandler.successHandler(res, `Success remove all industries for my store`);
        } catch (error) {
            console.log('>>>>>>>>>');
            responseHandler.errorHandler(res, error);
        }
    }

    async getListIndustryInMyStore(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const listIndustries = await this.shopQuery.getListIndustryInMyStore(Number(id));

            responseHandler.successHandler(res, listIndustries);
        } catch (error) {
            console.log('>>>>>>>>>');
            responseHandler.errorHandler(res, error);
        }
    }
}

export const buyerShopController = new BuyerShopController();
