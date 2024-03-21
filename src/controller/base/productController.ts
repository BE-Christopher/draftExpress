import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base";
import responseHandler from "./responseHandler";
import { GetAllProductLocation, ProductBaseDataQuery } from "../../models/dataQueries/base/Product.base.dataQueries";

export class ProductBaseController extends BaseController {
    productQuery = new ProductBaseDataQuery();

    async getList(req: Request, res: Response, next: NextFunction) {
        try {

            const {
                rating,
                industryId,
                productName,
                lowPrice,
                maxPrice,
                location,
                limit,
                page,
                shopId
            } = req.query;

            const result = await this.productQuery.getAllProduct({
                limit: Number(limit),
                page: Number(page),
                ...(industryId && { industryId: Number(industryId) }),
                ...(lowPrice && { lowPrice: Number(lowPrice) }),
                ...(maxPrice && { maxPrice: Number(maxPrice) }),
                ...(shopId && { shopId: Number(shopId) }),
                ...(rating && { rating: Number(rating) }),
                ...(productName && { productName: String(productName) }),
                ...(location && { location: location as GetAllProductLocation }),
            });

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await this.productQuery.getOneProduct(Number(id));
            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}
