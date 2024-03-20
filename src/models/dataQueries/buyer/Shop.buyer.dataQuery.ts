import { DeepPartial, UpdateResult } from "typeorm";
import { EShopStatus } from "../../../interfaces";
import ShopeBaseDataQuery, { IShopDataQuery } from "../base/Shop.base.dataQueries";
import { Shop } from "../../entities";

export interface IBuyerShopDataQuery extends IShopDataQuery {
    updateMyShop(id: number, payload: DeepPartial<Shop>): Promise<UpdateResult>;
    disableMyShop(id: number): Promise<UpdateResult>;
    closeMyShop(id: number): Promise<UpdateResult>;
}

class BuyerShopDataQuery extends ShopeBaseDataQuery implements IBuyerShopDataQuery {
    constructor() {
        super();
    }

    updateMyShop(id: number, payload: DeepPartial<Shop>) {
        return this.shopTB.update(id, payload);
    }

    disableMyShop(id: number) {
        return this.shopTB.update(id, {
            status: EShopStatus.Pause
        });
    }

    closeMyShop(id: number) {
        return this.shopTB.update(id, {
            status: EShopStatus.Close
        });
    }
}

export const buyerShopDataQuery = new BuyerShopDataQuery();
