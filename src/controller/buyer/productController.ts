import { NextFunction, Request, Response } from "express";
import { buyerIndustryDataQuery, buyerProductDataQuery, buyerShopDataQuery } from "../../models/dataQueries";
import { ProductBaseController } from "../base/productController";
import responseHandler from "../base/responseHandler";
import { ECurrencyUnit } from "../../interfaces";
import { Industry, Shop } from "../../models/entities";

export type ProductAssertData = {
    url: string;
};

export type ProductOptionsData = {
    type: string,
    isAvailable: boolean;
};

export enum ProductDeleteType {
    Soft = 'Soft',
    Hard = 'Hard'
}

class BuyerProductController extends ProductBaseController {
    productQuery = buyerProductDataQuery;

    async createNewProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                description,
                price,
                unit,
                asserts,
                shopId,
                industryId,
                inventory,
                ProductOptions
            } = req.body;

            // data field checking
            if (!(String(unit) in ECurrencyUnit)) {
                this.errorResponse({
                    code: 400,
                    error: this.errorMessage.doesExisted(`The unit like ${unit}`)
                });
            }
            // check shop - industry
            const currentStore = await buyerShopDataQuery.getOneById(Number(shopId));
            const currentIndustry = await buyerIndustryDataQuery.getOne({ id: Number(industryId) });
            if (!currentIndustry || !currentStore) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.doesExisted(`Store or industry`)
                });
            }

            const newProduct = await this.productQuery.createOneProduct({
                name,
                description,
                price,
                unit: unit as ECurrencyUnit,
                asserts: asserts as ProductAssertData[],
                inventory,
                shop: currentStore as Shop,
                industry: currentIndustry as Industry,
                productOptions: ProductOptions as ProductOptionsData[]
            });

            responseHandler.successHandler(res, newProduct);
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

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

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                description,
                price,
                unit,
                sold,
                inventory,
                id,
            } = req.body;

            // data field checking
            if (!(String(unit) in ECurrencyUnit)) {
                this.errorResponse({
                    code: 400,
                    error: this.errorMessage.doesExisted(`The unit like ${unit}`)
                });
            }

            await this.productQuery.updateProduct(Number(id), {
                name,
                description,
                price,
                unit,
                sold,
                inventory,
            });

            responseHandler.successHandler(res, `Success update product with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async addProductAsserts(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                id,
                asserts
            } = req.body;

            // check currentProducts
            const currentProducts = await this.productQuery.getOneProduct(id);
            if (!currentProducts) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.doesExisted(`The Product with id: ${id}`)
                });
            }
            const currentAsserts = currentProducts?.asserts ?? [];

            await this.productQuery.updateProduct(id, {
                asserts: [...currentAsserts, ...asserts]
            });

            responseHandler.successHandler(res, `Success update product with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async removeProductAsserts(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                id,
                asserts
            } = req.body;

            // check currentProducts
            const currentProducts = await this.productQuery.getOneProduct(id);
            if (!currentProducts) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.doesExisted(`The Product with id: ${id}`)
                });
            }
            const deletedAsserts = (currentProducts?.asserts ?? []).filter((item) => Array(asserts).includes(item.id));

            await this.productQuery.updateProduct(id, {
                asserts: deletedAsserts
            });

            responseHandler.successHandler(res, `Success update product with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export default new BuyerProductController();
