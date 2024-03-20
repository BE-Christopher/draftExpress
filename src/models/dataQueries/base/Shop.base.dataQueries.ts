import AppDataSource from "../../data-source";
import { Shop } from "../../entities";
import { } from 'typeorm';
export interface IShopDataQuery {
    getAll(payload: ShopGetAllPayload): Promise<Shop[]>;
    getOneById(id: number): Promise<Shop | null>;
}

export type IShopLocationQuery = {
    district?: string,
    ward?: string,
    country?: string;
};

export type ShopGetAllPayload = {
    industries?: number,
    location?: IShopLocationQuery,
    limit: number,
    page: number,
};

// select fields
export const shopShouldGettingFields = {
    id: true,
    name: true,
    description: true,
    status: true,
    asserts: {
        id: true,
        url: true
    },
    author: {
        id: true,
        locations: {
            address: true,
            country: true,
            district: true,
            id: true,
            street: true,
            ward: true,
        }
    },
    followers: {
        id: true,
    },
    products: {
        id: true,
        name: true,
        price: true,
        unit: true,
        sold: true,
        asserts: {
            id: true,
            url: true
        },
        industry: {
            id: true,
            name: true,
        },
        productOptions: {
            id: true,
            isAvailable: true,
            type: true
        },
        inventory: true,
    }
};

export default class ShopeBaseDataQuery implements IShopDataQuery {
    shopTB = AppDataSource.getRepository(Shop);

    getAll(payload: ShopGetAllPayload) {
        return this.shopTB.find(
            {
                select: shopShouldGettingFields,
                where: {
                    industries: {
                        id: payload?.industries
                    },
                    author: {
                        locations: {
                            district: payload?.location?.district,
                            ward: payload?.location?.ward,
                            country: payload?.location?.country,
                        }
                    },
                },
                relations: {
                    author: {
                        locations: true
                    },
                    industries: true,
                    followers: true,
                    products: true,
                    asserts: true,
                },
                skip: (payload.page - 1) * payload.limit,
                take: payload.limit,
            },
        );
    }

    getOneById(id: number) {
        return this.shopTB.findOne({
            select: shopShouldGettingFields,
            where: { id },
            relations: {
                author: {
                    locations: true
                },
                industries: true,
                followers: true,
                products: true,
                asserts: true,
            },

        });
    }
}
