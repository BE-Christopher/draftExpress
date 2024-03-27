import { DeepPartial, UpdateResult } from "typeorm";
import { EShopStatus } from "../../../interfaces";
import ShopeBaseDataQuery, { IShopDataQuery } from "../base/Shop.base.dataQueries";
import { Shop } from "../../entities";
import AppDataSource from "../../data-source";

interface IUserShopDataQuery extends IShopDataQuery {
    registerMyShop(payload: DeepPartial<Shop>): Promise<Shop>;
}

const shopTB = AppDataSource.getRepository(Shop);

class UserShopDataQuery extends ShopeBaseDataQuery implements IUserShopDataQuery {
    async registerMyShop(payload: DeepPartial<Shop>) {
        const newShop = await shopTB.create(payload);
        await shopTB.save(newShop);

        return newShop;
    }
}

export default new UserShopDataQuery();
