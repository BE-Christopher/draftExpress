import { DeleteResult, UpdateResult } from "typeorm";
import { IProductBaseDataQuery, ProductBaseDataQuery } from "../base/Product.base.dataQueries";

export interface IAdminProductDataQuery extends IProductBaseDataQuery {
    disableProduct(id: number): Promise<UpdateResult>;
    deleteProduct(id: number): Promise<DeleteResult>;
}

class AdminProductDataQuery extends ProductBaseDataQuery implements IAdminProductDataQuery {
    disableProduct(id: number) {
        return this.productTB.softDelete(id);
    }

    deleteProduct(id: number) {
        return this.productTB.delete(id);
    }
}

export const adminProductDataQuery = new AdminProductDataQuery();
