import AppDataSource from "../../data-source";
import { CartItem } from "../../entities";

const cartItemTb = AppDataSource.getRepository(CartItem);

export class CartItemDataQuery {
    getOne(id: number) {
        return cartItemTb.findOne({
            select: {
                id: true,
                chooseOption: {
                    id: true,
                    quantity: true,
                    productOption: {
                        id: true,
                        inventory: true,
                        type: true,
                    }
                },
                product: {
                    id: true,
                    name: true,
                    price: true,
                    unit: true,
                    shop: {
                        id: true,
                        name: true,
                    }
                }
            },
            where: { 
                id,
             },
            relations: {
                chooseOption: {
                    productOption: true
                },
                product: {
                    shop: true
                }
            }
        });
    }
}
