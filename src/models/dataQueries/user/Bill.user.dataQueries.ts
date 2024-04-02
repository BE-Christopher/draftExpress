import { DeepPartial, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, UpdateResult } from "typeorm";
import AppDataSource from "../../data-source";
import { Bill } from "../../entities";
import { EBillStatus } from "../../../interfaces";

export type BillFindOption = {
    options?: FindOptionsWhere<Bill>,
    relations?: FindOptionsRelations<Bill>;
    select?: FindOptionsSelect<Bill>;
};

export type BillGetAll = {
    limit: number,
    page: number,
    option?: FindOptionsWhere<Bill>,
};

export interface IUserBillDataQuery {
    createBill(payload: DeepPartial<Bill>): Promise<Bill>;
    getOne(payload: BillFindOption): Promise<Bill | null>;
    cancelBill(id: number): Promise<UpdateResult>;
    getAll(payload: BillGetAll): Promise<[Bill[], number]>;
}

const billTb = AppDataSource.getRepository(Bill);

const defaultRelations = {
    deliverPort: true,
    items: {
        chooseOption: {
            productOption: {
                product: true
            }
        }
    },
    shop: true
};

const defaultSelect = {
    id: true,
    deliverPort: {
        address: true,
        country: true,
        street: true,
        ward: true
    },
    items: {
        chooseOption: {
            id: true,
            quantity: true,
            productOption: {
                id: true,
                type: true,
                product: {
                    id: true,
                    price: true,
                    name: true,
                    description: true
                }
            }
        },
    },
    status: true,
    totalPrice: true,
    shop: {
        id: true,
        name: true,
        description: true,
    }
};

class UserBillDataQuery implements IUserBillDataQuery {
    async createBill(payload: DeepPartial<Bill>) {
        const newBill = await billTb.create(payload);
        await billTb.save(newBill);
        return newBill;
    }

    getOne(payload: BillFindOption) {
        const {
            options,
            relations,
            select
        } = payload;
        return billTb.findOne({
            select: select ?? defaultSelect,
            where: options,
            relations: relations ?? defaultRelations
        });
    }

    async cancelBill(id: number) {
        return billTb.update(id, { status: EBillStatus.Cancel });
    }

    getAll(payload: BillGetAll) {
        const {
            limit,
            page,
            option
        } = payload;

        return billTb.findAndCount({
            select: defaultSelect,
            where: option,
            skip: (page - 1) * limit,
            take: limit,
            relations: defaultRelations
        });
    }

    updateBill(id: number, payload: DeepPartial<Bill>) {
        return billTb.update(id, payload);
    }
}

export const userBillDataQuery = new UserBillDataQuery();
