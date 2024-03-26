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

const industryTb = AppDataSource.getRepository(Industry);

export class IndustryBaseDataQuery implements IIndustryDataQuery {

    getAll(payload: GetIndustryPayload) {
        return industryTb.find({
            select: {
                id: true,
                name: true,
            },
            where: {
                name: payload?.name ? `%${payload.name}%` : undefined,
                // products: {
                //     name: `%${payload.productName}%`
                // }
            },
            skip: (payload.page - 1) * payload.limit,
            take: payload.limit
        });
    }

    getOne(options: FindOptionsWhere<Industry>) {
        return industryTb.findOne({ where: options });
    }
}
