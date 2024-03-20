import { UpdateResult } from "typeorm";
import { EShopStatus } from "../../../interfaces";
import ShopeBaseDataQuery, { IShopDataQuery } from "../base/Shop.base.dataQueries";

interface IUserShopDataQuery extends IShopDataQuery {
    registerMyShop(id: number): Promise<UpdateResult>;
}

class UserShopDataQuery extends ShopeBaseDataQuery implements IUserShopDataQuery {
    constructor() {
        super();
    }

    registerMyShop(id: number) {
        return this.shopTB.update(id, {
            status: EShopStatus.Active
        });
    }
}

export default new UserShopDataQuery();
