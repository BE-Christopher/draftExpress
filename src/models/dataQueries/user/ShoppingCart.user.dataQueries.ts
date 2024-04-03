import { FindManyOptions, FindOptionsWhere } from "typeorm";
import AppDataSource from "../../data-source";
import { CartItem, Product, ProductOptions, Shop, ShoppingCart, User } from "../../entities";

export interface IUserShoppingCart { }

const shoppingCartTb = AppDataSource.getRepository(ShoppingCart);
const cartItemTb = AppDataSource.getRepository(CartItem);

export class UserShoppingCartDataQuery implements IUserShoppingCart {
    async initCart(author: User) {
        const newCart = await shoppingCartTb.create({
            author: author,
        });
        await shoppingCartTb.save(newCart);
        return newCart;
    }

    getListCartItems(payload: {
        id: number,
        limit: number,
        page: number,
    }) {
        const { id, limit, page } = payload;
        return cartItemTb.findAndCount({
            select: {
                id: true,
                chooseOption: {
                    id: true,
                    quantity: true,
                    productOption: {
                        id: true,
                        inventory: true,
                        type: true,
                    },
                },
                product: {
                    asserts: true,
                    id: true,
                    name: true,
                    shop: {
                        id: true,
                        author: {
                            id: true,
                        },
                        asserts: true,
                        name: true,
                    },
                    description: true,
                }
            },
            where: {
                cart: {
                    id
                }
            },
            relations: {
                cart: true,
                chooseOption: {
                    productOption: true
                },
                product: {
                    shop: { author: true },
                    asserts: true,
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async addNewCartItem(
        payload: {
            product: Product,
            chooseOption: ProductOptions,
            quantity: number,
            cartId: number,
        }
    ) {
        const {
            chooseOption,
            product,
            quantity,
            cartId
        } = payload;
        const currentCart = await shoppingCartTb.findOne({
            where: { id: cartId },
            relations: { items: true }
        });

        const updatingCartItems = currentCart?.items ?? [];
        // create new cartItem
        const newItem = await cartItemTb.create({
            cart: currentCart as ShoppingCart,
            product,
            chooseOption: {
                productOption: chooseOption,
                quantity,
            }
        });
        updatingCartItems.push(newItem);
        await shoppingCartTb.save({
            ...currentCart,
            items: updatingCartItems,
        });

        return currentCart;
    }

    getOne(options: FindOptionsWhere<ShoppingCart>) {
        return shoppingCartTb.find({ where: options });
    }
}
