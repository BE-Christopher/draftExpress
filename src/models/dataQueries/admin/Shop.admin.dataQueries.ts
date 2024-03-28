import { EShopStatus } from "../../../interfaces";
import AppDataSource from "../../data-source";
import { Shop } from "../../entities";
import ShopeBaseDataQuery, { IShopDataQuery } from "../base/Shop.base.dataQueries";

export interface IAdminShopDataQuery extends IShopDataQuery { }

const shopTB = AppDataSource.getRepository(Shop);
class AdminShopDataQuery extends ShopeBaseDataQuery implements IAdminShopDataQuery {
    hardDelete(id: number) {
        return shopTB.delete(id);
    }

    disableShop(id: number) {
        return shopTB.update(id, { status: EShopStatus.Pause });
    }
}

export const adminShopDataQuery = new AdminShopDataQuery();
