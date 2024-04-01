import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { ProductOptions } from "./ProductOptions";
import { CartItem } from "./CartItem";


@Entity({ name: 'cart_item_option' })
export class CartItemOptions extends BaseEntity {
    @OneToOne(() => CartItem, cartItem => cartItem.chooseOption)
    cartItem: CartItem;

    @OneToOne(() => ProductOptions, productOption => productOption.cartItemOption)
    productOption: ProductOptions;

    @Column({ nullable: false, default: 1 })
    quantity: number;
}
