import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { Product } from "./Product";


@Entity({ name: 'product_Options' })
export class ProductOptions extends BaseEntity {
    @Column({ nullable: false })
    type: string;

    @Column({ default: true })
    isAvailable: boolean;

    @ManyToOne(() => Product, product => product.productOptions)
    product: Product;
}
