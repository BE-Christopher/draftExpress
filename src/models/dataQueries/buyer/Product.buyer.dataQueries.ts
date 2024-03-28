import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { IProductBaseDataQuery, ProductBaseDataQuery } from "../base/Product.base.dataQueries";
import { Product } from "../../entities";
import AppDataSource from "../../data-source";

export interface IBuyerProductDataQuery extends IProductBaseDataQuery {
    createOneProduct(payload: DeepPartial<Product>): Promise<Product>;
    updateProduct(id: number, payload: DeepPartial<Product>): Promise<UpdateResult>;
    disableProduct(id: number): Promise<UpdateResult>;
    deleteProduct(id: number): Promise<DeleteResult>;
}

const productTB = AppDataSource.getRepository(Product);

class BuyerProductDataQuery extends ProductBaseDataQuery implements IBuyerProductDataQuery {
    async createOneProduct(payload: DeepPartial<Product>) {
        const newProduct = await productTB.create(payload);
        await productTB.save(newProduct);
        return newProduct;
    }

    updateProduct(id: number, payload: DeepPartial<Product>) {
        return productTB.update(id, payload);
    }

    disableProduct(id: number) {
        return productTB.softDelete(id);
    }

    deleteProduct(id: number) {
        return productTB.delete(id);
    }
}

export const buyerProductDataQuery = new BuyerProductDataQuery();
