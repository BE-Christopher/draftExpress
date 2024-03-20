import { Column, Entity, ManyToMany, OneToMany, OneToOne } from "typeorm";
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

    @OneToOne(() => User, user => user.id)
    author: User;

    @ManyToMany(() => Industry, { nullable: false, cascade: true })
    industries: Industry[];

    @Column({ type: 'enum', enum: EShopStatus, default: EShopStatus.Inactive })
    status: EShopStatus;

    @ManyToMany(() => User, { cascade: true, nullable: true })
    followers: User[];

    @OneToMany(() => ShopAsserts, shopAsserts => shopAsserts.id, { cascade: true, nullable: true })
    asserts: ShopAsserts[];

    @OneToMany(() => Product, product => product.id, { cascade: true })
    products: Product[];
}
