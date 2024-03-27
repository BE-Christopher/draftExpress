import { DeepPartial, UpdateResult } from "typeorm";
import { EShopStatus } from "../../../interfaces";
import ShopeBaseDataQuery, { IShopDataQuery } from "../base/Shop.base.dataQueries";
import { Industry, Shop } from "../../entities";
import AppDataSource from "../../data-source";

export interface IBuyerShopDataQuery extends IShopDataQuery {
    updateMyShop(id: number, payload: DeepPartial<Shop>): Promise<UpdateResult>;
    disableMyShop(id: number): Promise<UpdateResult>;
    closeMyShop(id: number): Promise<UpdateResult>;
}

const shopTB = AppDataSource.getRepository(Shop);

class BuyerShopDataQuery extends ShopeBaseDataQuery implements IBuyerShopDataQuery {
    constructor() {
        super();
    }

    updateMyShop(id: number, payload: DeepPartial<Shop>) {
        return shopTB.update(id, payload);
    }

    disableMyShop(id: number) {
        return shopTB.update(id, {
            status: EShopStatus.Pause
        });
    }

    closeMyShop(id: number) {
        return shopTB.update(id, {
            status: EShopStatus.Close
        });
    }

    async addNewIndustryForMyStore(shopId: number, industry: Industry) {
        const currentShop = await shopTB.findOne({
            where: {
                id: shopId
            },
            relations: { industries: true }
        });
        console.log("🚀 ~ BuyerShopDataQuery ~ addNewIndustryForMyStore ~ currentShop:", currentShop);

        currentShop?.industries.push(industry);

        await shopTB.save(currentShop as Shop);
        return currentShop;
    }

    async getListIndustryInMyStore(shopId: number) {
        const myStore = await shopTB.findOne({
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                industries: {
                    id: true,
                    name: true,
                    products: { id: true },
                }
            },
            where: {
                id: shopId,
            },
            relations: {
                industries: true,
            }
        });

        return myStore?.industries?.length ? myStore?.industries?.map(item => ({
            id: item.id,
            name: item.name,
            totalProduct: item?.products?.length ?? 0,
        })) : [];
    }

    async removeIndustries(industries: number[], shopId: number) {
        const currentShopIndustries = await shopTB.find({
            where: { id: shopId }
        });
        const removedShopIndustries = currentShopIndustries.filter((item) => !(item.id in industries));

        // WIP - remove all products has removed industry

        return await shopTB.update(shopId, {
            ...currentShopIndustries,
            industries: removedShopIndustries,
        });
    }
}

export const buyerShopDataQuery = new BuyerShopDataQuery();
