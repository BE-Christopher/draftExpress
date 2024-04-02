'use strict';

import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { EGender, EUserRole } from "../../interfaces/User.baseController";
import { Location } from "./Location";
import { BaseEntity } from "./Base";
import { Shop } from "./Shop";
import { Feedback } from "./Feedback";
import { ShoppingCart } from "./ShoppingCart";
import { Bill } from "./Bill";
import { CardWallet } from "./CardWallet";

@Entity()
export class User extends BaseEntity {
    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    personalId: string;

    @Column({ nullable: false, default: 'Registering User' })
    name: string;

    @Column({ nullable: true })
    birthDate: Date;

    @Column({ nullable: true })
    age: number;

    @Column({ nullable: false, type: 'enum', enum: EGender, default: EGender.Unknown })
    gender: EGender;

    @Column({ nullable: false, type: 'enum', enum: EUserRole, default: EUserRole.User })
    role: EUserRole;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Location, location => location.id, { cascade: true, nullable: true })
    locations: Location[];

    @OneToOne(() => Shop, shop => shop.author, { nullable: true, cascade: true })
    @JoinColumn()
    shop: Shop;

    @ManyToMany(() => Shop, shop => shop.followers)
    shopFollowing: Shop[];

    @OneToMany(() => Feedback, feedback => feedback.id, { nullable: true, cascade: true })
    feedbacks: Feedback[];

    @Column({ nullable: true })
    avatar: string;

    @OneToOne(() => ShoppingCart, shoppingCart => shoppingCart.author, { nullable: true, cascade: true })
    @JoinColumn()
    cart: ShoppingCart;

    @OneToMany(() => Bill, bills => bills.author)
    bills: Bill[];

    @OneToMany(() => CardWallet, cartWallet => cartWallet.author)
    cards: CardWallet[];
}
