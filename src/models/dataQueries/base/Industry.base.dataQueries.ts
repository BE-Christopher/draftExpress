import { FindOptionsWhere, Like } from "typeorm";
import AppDataSource from "../../data-source";
import { Industry } from "../../entities";

export interface IIndustryDataQuery {
    getAll(payload: GetIndustryPayload): Promise<Industry[]>;
    getOne(options: FindOptionsWhere<Industry>): Promise<Industry | null>;
}

export type GetIndustryPayload = {
    limit: number,
    page: number,
    name?: string,
    productName?: string;
};

export class IndustryBaseDataQuery implements IIndustryDataQuery {
    industryTb = AppDataSource.getRepository(Industry);

    getAll(payload: GetIndustryPayload) {
        return this.industryTb.find({
            select: {
                id: true,
                name: true,
            },
            where: {
                name: payload.name ? Like(payload.name) : undefined,
                products: {
                    name: payload.productName ? Like(payload.productName) : undefined
                }
            },
            skip: (payload.page - 1) * payload.limit,
            take: payload.limit
        });
    }

    getOne(options: FindOptionsWhere<Industry>) {
        return this.industryTb.findOne({ where: options });
    }
}
