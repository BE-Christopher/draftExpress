import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./Base";
import { ECurrencyUnit } from "../../interfaces";
import { ProductAsserts } from "./ProductAssert";
import { Feedback } from "./Feedback";
import { Shop } from "./Shop";
import { Industry } from "./Industry";
import { ProductOptions } from "./ProductOptions";


@Entity({ name: 'products' })
export class Product extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ type: 'enum', enum: ECurrencyUnit, default: ECurrencyUnit.VND })
    unit: ECurrencyUnit;

    @Column({ nullable: false })
    price: number;

    @Column({ nullable: false })
    description: string;

    @OneToMany(() => ProductAsserts, productAsserts => productAsserts.id)
    asserts: ProductAsserts[];

    @OneToMany(() => Feedback, feedback => feedback.id)
    feedbacks: Feedback[];

    @ManyToOne(() => Shop, shop => shop.products)
    shop: Shop;

    @ManyToOne(() => Industry, industry => industry.products)
    industry: Industry;

    @Column({ default: 0 })
    sold: number;

    @OneToMany(() => ProductOptions, productOptions => productOptions.id, { nullable: true, cascade: true })
    productOptions: ProductOptions[];

    @Column({ type: 'json', nullable: true })
    productOptionList: any[];
}
