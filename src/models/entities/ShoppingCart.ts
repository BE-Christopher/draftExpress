import { Entity, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { User } from "./User";
import { CartItem } from "./CartItem";


@Entity({ name: 'shopping_cart' })
export class ShoppingCart extends BaseEntity {
    @OneToOne(() => User, user => user.cart)
    author: User;

    @OneToMany(() => CartItem, cartItem => cartItem.product, { nullable: true, cascade: true })
    items: CartItem[];
}
