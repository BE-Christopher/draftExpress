import { FindOptionsWhere } from "typeorm";
import AppDataSource from "../../data-source";
import { ProductOptions } from "../../entities";

const productOptionTb = AppDataSource.getRepository(ProductOptions);

interface IProductOptionDataQuery {
    getOne(options: FindOptionsWhere<ProductOptions>): Promise<ProductOptions | null>;
}

export class ProductOptionBaseDataQuery implements IProductOptionDataQuery {
    getOne(options: FindOptionsWhere<ProductOptions>) {
        return productOptionTb.findOne({ where: options });
    }
}
