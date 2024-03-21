import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { IProductBaseDataQuery, ProductBaseDataQuery } from "../base/Product.base.dataQueries";
import { Product } from "../../entities";

export interface IBuyerProductDataQuery extends IProductBaseDataQuery {
    createOneProduct(payload: DeepPartial<Product>): Promise<Product>;
    updateProduct(id: number, payload: DeepPartial<Product>): Promise<UpdateResult>;
    disableProduct(id: number): Promise<UpdateResult>;
    deleteProduct(id: number): Promise<DeleteResult>;
}

class BuyerProductDataQuery extends ProductBaseDataQuery implements IBuyerProductDataQuery {
    async createOneProduct(payload: DeepPartial<Product>) {
        const newProduct = await this.productTB.create(payload);
        await this.productTB.save(newProduct);
        return newProduct;
    }

    updateProduct(id: number, payload: DeepPartial<Product>) {
        return this.productTB.update(id, payload);
    }

    disableProduct(id: number) {
        return this.productTB.softDelete(id);
    }

    deleteProduct(id: number) {
        return this.productTB.delete(id);
    }
}

export const buyerProductDataQuery = new BuyerProductDataQuery();
