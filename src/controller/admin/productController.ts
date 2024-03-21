import { adminProductDataQuery } from "../../models/dataQueries";
import { ProductBaseController } from "../base/productController";
import responseHandler from "../base/responseHandler";
import { ProductDeleteType } from "../buyer";
import { NextFunction, Request, Response } from "express";


class AdminProductController extends ProductBaseController {
    productQuery = adminProductDataQuery;

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                id,
                type
            } = req.body;

            // check type
            if (!(String(type) in ProductDeleteType)) {
                this.errorResponse({
                    code: 400,
                    error: this.errorMessage.doesExisted(`This delete type: ${type}`)
                });
            }

            if (String(type === ProductDeleteType.Soft)) {
                await this.productQuery.disableProduct(id);
            } else {
                await this.productQuery.deleteProduct(id);
            }

            responseHandler.successHandler(res, `Success ${type} delete product with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export default new AdminProductController();
