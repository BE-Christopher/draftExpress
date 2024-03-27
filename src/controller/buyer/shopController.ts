import { NextFunction, Request, Response } from "express";
import { EShopStatus, EUserRole } from "../../interfaces";
import { buyerIndustryDataQuery, buyerShopDataQuery } from '../../models/dataQueries/buyer';
import UserBuyerDataQueries from "../../models/dataQueries/buyer/User.buyer.dataQueries";
import { Industry, User } from "../../models/entities";
import responseHandler from "../base/responseHandler";
import { ShopBaseController } from "../base/shop";


const shopQuery = buyerShopDataQuery;

class BuyerShopController extends ShopBaseController {

    // WIP
    async updateMyStore(req: Request, res: Response, next: NextFunction) {
        console.log('>>>>>>>>>>>>>>');

        try {
            const { id } = req.params;
            const {
                description,
                name,
            } = req.body;

            const currentUser = req?.user as User;

            const currentStore = await shopQuery.getOneById(Number(id));
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
            await shopQuery.updateMyShop(Number(id), {
                description,
                name,
            });

            responseHandler.successHandler(res, `Success update your store`);
        } catch (error) {
            console.log('><>>>>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async closeOrDisableShop(req: Request, res: Response, next: NextFunction) {
        try {
            const { type } = req.body;
            const { id } = req.params;
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
                await shopQuery.disableMyShop(Number(id));
            } else {
                await shopQuery.closeMyShop(Number(id));
            }

            responseHandler.successHandler(res, `Success ${type} your store`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async importNewIndustry(req: Request, res: Response, next: NextFunction) {
        try {
            const { industryId } = req.body;
            const { id } = req.params

            const importingIndustry = await buyerIndustryDataQuery.getOne({ id: Number(industryId) });
            // check is existed industry
            if (!importingIndustry) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.isExisted(`The Industry with id: ${industryId}`)
                });
            }

            await shopQuery.addNewIndustryForMyStore(Number(id), importingIndustry as Industry);

            responseHandler.successHandler(res, `Success add new industry with id: ${industryId} into your store`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async removeNewIndustry(req: Request, res: Response, next: NextFunction) {
        try {
            const { shopId, industries } = req.body;

            await shopQuery.removeIndustries(industries, Number(shopId));

            responseHandler.successHandler(res, `Success remove all industries for my store`);
        } catch (error) {
            console.log('>>>>>>>>>');
            responseHandler.errorHandler(res, error);
        }
    }

    async getListIndustryInMyStore(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const listIndustries = await shopQuery.getListIndustryInMyStore(Number(id));

            responseHandler.successHandler(res, listIndustries);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const buyerShopController = new BuyerShopController();
