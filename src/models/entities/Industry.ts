import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./Base";
import { Shop } from "./Shop";
import { Product } from "./Product";

@Entity({ name: 'industries' })
export class Industry extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @ManyToMany(() => Shop, shop => shop.industries)
    shops: Shop[];

    @OneToMany(() => Product, product => product.id)
    products: Product[];
}
