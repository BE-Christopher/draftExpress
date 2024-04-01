import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { ShoppingCart } from "./ShoppingCart";
import { Product } from "./Product";
import { CartItemOptions } from "./CartItemOption";
import { Bill } from "./Bill";


@Entity({ name: 'cart_items' })
export class CartItem extends BaseEntity {
    @ManyToOne(() => ShoppingCart, shoppingCart => shoppingCart.items)
    cart: ShoppingCart;

    @ManyToOne(() => Product, product => product.carts)
    product: Product;

    @OneToOne(() => CartItemOptions, cartItemOption => cartItemOption.cartItem, { cascade: true })
    @JoinColumn()
    chooseOption: CartItemOptions;

    @ManyToOne(() => Bill, bill => bill.items)
    bill: Bill;
}
