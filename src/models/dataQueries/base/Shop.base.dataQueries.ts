import { EShopStatus } from "../../../interfaces";
import AppDataSource from "../../data-source";
import { Shop } from "../../entities";
import { } from 'typeorm';
export interface IShopDataQuery {
    getAll(payload: ShopGetAllPayload): Promise<[Shop[], number]>;
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

export type GetAllShopByIndustry = {
    industryId: number,
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
    }
};
const shopTB = AppDataSource.getRepository(Shop);
export default class ShopeBaseDataQuery implements IShopDataQuery {

    getAll(payload: ShopGetAllPayload) {
        return shopTB.findAndCount(
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
                    author: true,
                },
                skip: (payload.page - 1) * payload.limit,
                take: payload.limit,
            },
        );
    }

    getOneById(id: number) {
        return shopTB.findOne({
            where: { id },
            relations: {
                author: true,
            },

        });
    }

    getListShopBaseOnIndustry({ industryId, limit, page }: GetAllShopByIndustry) {
        return shopTB.find({
            select: {
                id: true,
                asserts: true,
                author: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    locations: {
                        address: true,
                        country: true,
                        district: true,
                        id: true,
                        street: true,
                        ward: true,
                    }
                },
                description: true,
                followers: { id: true },
                name: true,
            },
            where: {
                industries: {
                    id: industryId,
                },
                status: EShopStatus.Active
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
}
