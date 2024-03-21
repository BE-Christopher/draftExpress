import { DeepPartial, UpdateResult } from "typeorm";
import { EShopStatus } from "../../../interfaces";
import ShopeBaseDataQuery, { IShopDataQuery } from "../base/Shop.base.dataQueries";
import { Industry, Shop } from "../../entities";

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

    async addNewIndustryForMyStore(shopId: number, industry: Industry) {
        const currentShop = await this.shopTB.findOne({
            select: {
                id: true,
                industries: true
            },
            where: {
                id: shopId
            }
        });
        const industriesUpdating = currentShop?.industries ?? [];
        industriesUpdating?.push(industry);
        return this.shopTB.update(shopId, {
            ...currentShop,
            industries: industriesUpdating
        });
    }

    async getListIndustryInMyStore(shopId: number) {
        const myStore = await this.shopTB.findOne({
            select: {
                industries: {
                    id: true,
                    name: true,
                    products: { id: true },
                }
            },
            where: {
                id: shopId,
            }
        });

        return myStore?.industries.map((item) => ({
            id: item.id,
            name: item.name,
            totalProducts: item.products.length
        }));
    }

    async removeIndustries(industries: number[], shopId: number) {
        const currentShopIndustries = await this.shopTB.find({
            where: { id: shopId }
        });
        const removedShopIndustries = currentShopIndustries.filter((item) => !(item.id in industries));

        // WIP - remove all products has removed industry

        return await this.shopTB.update(shopId, {
            ...currentShopIndustries,
            industries: removedShopIndustries,
        });
    }
}

export const buyerShopDataQuery = new BuyerShopDataQuery();
