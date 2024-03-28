import { DeepPartial, DeleteResult } from "typeorm";
import { ProductOptions } from "../../entities";
import AppDataSource from "../../data-source";

interface IBuyerProductOptionsDataQuery {
    addOne(payload: DeepPartial<ProductOptions>): Promise<ProductOptions>;
    removeOne(id: number): Promise<DeleteResult>;
}

class BuyerProductOptionsDataQuery implements IBuyerProductOptionsDataQuery {
    productOptionTb = AppDataSource.getRepository(ProductOptions);
    async addOne(payload: DeepPartial<ProductOptions>) {
        const newProductOptions = await this.productOptionTb.create(payload);
        await this.productOptionTb.save(newProductOptions);
        return newProductOptions;
    }

    removeOne(id: number) {
        return this.productOptionTb.delete(id);
    }
}

export const buyerProductOptionsDataQuery = new BuyerProductOptionsDataQuery();
