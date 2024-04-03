import AppDataSource from "../../data-source";
import { Bill } from "../../entities";
import { BillGetAll } from "../user";

const billTb = AppDataSource.getRepository(Bill);

type AdminBillGetAll = BillGetAll;

const baseSelect = {
    id: true,
    status: true,
    totalPrice: true,
    items: {
        id: true,
        product: {
            id: true,
            name: true,
            description: true,
            price: true,
            unit: true,
        },
        chooseOption: {
            id: true,
            quantity: true,
            productOption: {
                inventory: true
            }
        },
    },
    author: {
        id: true,
        name: true,
    },
    deliverPort: {
        id: true,
        address: true,
        street: true,
        ward: true,
        country: true,
        district: true,
        locationType: true
    }
};

const baseRelations = {
    author: true,
    items: {
        product: true,
        chooseOption: {
            productOption: true
        }
    },
    deliverPort: true,
    shop: true,
    payment: true
};

class AdminBillDataQuery {
    getList(payload: AdminBillGetAll) {
        const {
            limit,
            page,
            option
        } = payload;

        return billTb.findAndCount({
            select: baseSelect,
            where: option,
            skip: (page - 1) * limit,
            take: limit,
            relations: baseRelations
        });
    }

    getOne(id: number) {
        return billTb.findOne({
            select: baseSelect,
            where: { id },
            relations: baseRelations
        });
    }
}

export const adminBillDataQuery = new AdminBillDataQuery();
