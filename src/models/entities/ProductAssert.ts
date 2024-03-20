import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { Shop } from "./Shop";
import { Product } from "./Product";

@Entity({ name: 'product_asserts' })
export class ProductAsserts extends BaseEntity {
    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => Product, product => product.asserts)
    product: Product;
}
