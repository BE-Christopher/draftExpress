import { EBillStatus } from "../../../interfaces";
import AppDataSource from "../../data-source";
import { Bill, CartItem, ProductOptions } from "../../entities";
import { BillGetAll } from "../user";
import * as bluebirdPromise from 'bluebird';

interface IBuyerBillDataQuery { }

const billTb = AppDataSource.getRepository(Bill);
const productOptionTb = AppDataSource.getRepository(ProductOptions);

type BuyerBillGetAll = BillGetAll;

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

class BuyerBillDataQuery implements IBuyerBillDataQuery {
    getList(payload: BuyerBillGetAll) {
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

    rejectBill(id: number) {
        return billTb.update(id, { status: EBillStatus.Reject });
    }

    async approvedBill(id: number) {
        try {
            const currentBill = await this.getOne(id);
            const result = await bluebirdPromise.mapSeries((currentBill?.items as CartItem[]), async (item) => {
                const currentInventory = Number(item.chooseOption.productOption.inventory);
                const currentQuantity = Number(item.chooseOption.quantity);
                if (currentQuantity <= currentInventory) {
                    await productOptionTb.update(item.chooseOption.id, { inventory: currentInventory - currentQuantity });
                } else {
                    throw new Error(`Product with id: ${item.id} inventory not enough`);
                }
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export const buyerBillDataQuery = new BuyerBillDataQuery();
