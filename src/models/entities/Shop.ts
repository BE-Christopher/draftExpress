import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { User } from "./User";
import { Industry } from "./Industry";
import { EShopStatus } from "../../interfaces";
import { ShopAsserts } from "./ShopAssert";
import { Product } from "./Product";

@Entity({ name: 'shops' })
export class Shop extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @OneToOne(() => User, user => user.shop)
    author: User;

    @ManyToMany(() => Industry, { nullable: true, cascade: true })
    @JoinTable()
    industries: Industry[];

    @Column({ type: 'enum', enum: EShopStatus, default: EShopStatus.Inactive })
    status: EShopStatus;

    @ManyToMany(() => User, { cascade: true, nullable: true })
    @JoinTable()
    followers: User[];

    @OneToMany(() => ShopAsserts, shopAsserts => shopAsserts.id, { cascade: true, nullable: true })
    asserts: ShopAsserts[];

    @OneToMany(() => Product, product => product.shop, { cascade: true })
    products: Product[];
}
