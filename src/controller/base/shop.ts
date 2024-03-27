import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base";
import responseHandler from "./responseHandler";
import ShopeBaseDataQuery from "../../models/dataQueries/base/Shop.base.dataQueries";

const shopQuery = new ShopeBaseDataQuery();

export class ShopBaseController extends BaseController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                limit,
                page,
                industries,
                district,
                ward,
                country,
            } = req.query;
            const [shops, totalShops] = await shopQuery.getAll({
                limit: Number(limit),
                page: Number(page),
                industries: industries ? Number(industries) : undefined,
                location: {
                    country: country ? String(country) : undefined,
                    district: district ? String(district) : undefined,
                    ward: ward ? String(ward) : undefined,
                }
            });
            // calculate total page
            const totalPage = Number(totalShops) % Number(limit);

            responseHandler.successHandler(res, {
                shops,
                totalPage,
                currentPage: Number(page)
            });
        } catch (error) {
            console.log('>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    };

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await shopQuery.getOneById(Number(id));
            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    };

    async getAllByIndustry(req: Request, res: Response, next: NextFunction) {
        try {
            const { industryId } = req.params;
            const { limit, page } = req.query;
            const result = await shopQuery.getListShopBaseOnIndustry({
                industryId: Number(industryId),
                limit: Number(limit),
                page: Number(page),
            });

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}
