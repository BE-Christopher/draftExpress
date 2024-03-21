import { Between, DeepPartial, Like, MoreThanOrEqual } from "typeorm";
import AppDataSource from "../../data-source";
import { Product } from "../../entities";
import { EShopStatus } from "../../../interfaces";

const maxRangerPrice = 999999999999999999999999;

const shopGettingRelations = {
    asserts: true,
    shop: true,
    industry: true,
    feedbacks: true,
};

export interface IProductBaseDataQuery {
    getAllProduct(payload: GetAllProductPayload): Promise<[Product[], number]>;
    getOneProduct(id: number): Promise<Product | null>;
}

export type GetAllProductLocation = {
    country?: string,
    ward?: string,
    district?: string;
};

export type GetAllProductPayload = {
    rating?: number,
    industryId?: number;
    productName?: string;
    lowPrice?: number;
    maxPrice?: number;
    location?: GetAllProductLocation;
    limit: number;
    page: number;
    shopId?: number;
};

export class ProductBaseDataQuery implements IProductBaseDataQuery {
    productTB = AppDataSource.getRepository(Product);

    getAllProduct({
        rating,
        industryId,
        productName,
        lowPrice,
        maxPrice,
        location,
        limit,
        page,
        shopId
    }: GetAllProductPayload) {
        const selectOptions = {
            id: true,
            asserts: {
                url: true,
                id: true
            },
            industry: {
                id: true,
                name: true,
            },
            name: true,
            price: true,
            unit: true,
            feedbacks: {
                rating: true
            },
            sold: true,
            productOptions: {
                id: true,
                type: true,
            },
            shop: {
                author: {
                    name: true,
                    email: true,
                    id: true,
                    phone: true
                },
                name: true,
                asserts: {
                    url: true,
                    id: true,
                }
            }
        };

        return this.productTB.findAndCount({
            select: selectOptions,
            where: {
                feedbacks: {
                    rating: rating ? MoreThanOrEqual(rating) : undefined
                },
                industry: {
                    id: industryId
                },
                name: Like(`%${productName}%`),
                price: (lowPrice || maxPrice) ? Between(lowPrice ?? 0, maxPrice ?? maxRangerPrice) : undefined,
                shop: {
                    id: shopId ?? undefined,
                    industries: {
                        id: industryId
                    },
                    status: EShopStatus.Active,
                    author: {
                        locations: {
                            country: location?.country ?? undefined,
                            district: location?.district ?? undefined,
                            ward: location?.ward ?? undefined
                        }
                    },
                },
            },
            relations: shopGettingRelations,
            skip: (page - 1) * limit,
            take: limit,
            // order: late
        });
    }

    getOneProduct(id: number) {
        return this.productTB.findOne({
            select: {
                id: true,
                name: true,
                price: true,
                unit: true,
                description: true,
                sold: true,
                productOptionList: true,
                shop: {
                    id: true,
                    asserts: {
                        id: true,
                        url: true
                    },
                    description: true,
                    name: true,
                    author: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                productOptions: {
                    id: true,
                    isAvailable: true,
                    type: true,
                    inventory: true,
                },
                asserts: {
                    id: true,
                    url: true
                },
                industry: {
                    id: true,
                    name: true
                },
            },
            where: {
                id,
                shop: {
                    status: EShopStatus.Active,
                }
            },
            relations: shopGettingRelations,
        });
    }
}
