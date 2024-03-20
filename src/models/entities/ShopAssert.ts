import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { Shop } from "./Shop";

@Entity({ name: 'shop_asserts' })
export class ShopAsserts extends BaseEntity {
    @Column({ nullable: false })
    url: string

    @ManyToOne(()=> Shop, shop => shop.asserts)
    shop: Shop
}
