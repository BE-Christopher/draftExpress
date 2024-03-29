import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { Product } from "./Product";
import { CartItemOptions } from "./CartItemOption";


@Entity({ name: 'product_Options' })
export class ProductOptions extends BaseEntity {
    @Column({ nullable: false, type: 'json' })
    type: any[];

    @Column({ default: true })
    isAvailable: boolean;

    @Column({ default: 0 })
    inventory: number;

    @ManyToOne(() => Product, product => product.productOptions)
    product: Product;

    @OneToOne(() => CartItemOptions, cartItemOption => cartItemOption.productOption, { cascade: true, nullable: true })
    cartItemOption: CartItemOptions;
}
