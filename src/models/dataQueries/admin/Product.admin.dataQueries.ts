import { DeleteResult, UpdateResult } from "typeorm";
import { IProductBaseDataQuery, ProductBaseDataQuery } from "../base/Product.base.dataQueries";
import AppDataSource from "../../data-source";
import { Product } from "../../entities";

export interface IAdminProductDataQuery extends IProductBaseDataQuery {
    disableProduct(id: number): Promise<UpdateResult>;
    deleteProduct(id: number): Promise<DeleteResult>;
}

const productTB = AppDataSource.getRepository(Product);
class AdminProductDataQuery extends ProductBaseDataQuery implements IAdminProductDataQuery {
    disableProduct(id: number) {
        return productTB.softDelete(id);
    }

    deleteProduct(id: number) {
        return productTB.delete(id);
    }
}

export const adminProductDataQuery = new AdminProductDataQuery();
