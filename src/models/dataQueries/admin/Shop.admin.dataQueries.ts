import { EShopStatus } from "../../../interfaces";
import ShopeBaseDataQuery, { IShopDataQuery } from "../base/Shop.base.dataQueries";

export interface IAdminShopDataQuery extends IShopDataQuery { }

class AdminShopDataQuery extends ShopeBaseDataQuery implements IAdminShopDataQuery {
    hardDelete(id: number) {
        return this.shopTB.delete(id);
    }

    disableShop(id: number) {
        return this.shopTB.update(id, { status: EShopStatus.Pause });
    }
}

export default new AdminShopDataQuery();
