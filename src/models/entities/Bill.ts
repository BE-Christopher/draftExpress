import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { EBillStatus } from "../../interfaces";
import { User } from "./User";
import { Location } from "./Location";
import { CartItem } from "./CartItem";
import { Shop } from "./Shop";
import { Payment } from "./Payment";

@Entity({ name: 'bills' })
export class Bill extends BaseEntity {
    @Column({ nullable: false })
    totalPrice: number;

    @Column({ nullable: false, type: 'enum', enum: EBillStatus, default: EBillStatus.WaitingApprove })
    status: EBillStatus;

    @ManyToOne(() => User, user => user.bills, { cascade: true, nullable: false })
    author: User;

    @OneToOne(() => Location, location => location.billDeliver, { cascade: true, nullable: false })
    @JoinColumn()
    deliverPort: Location;

    @OneToOne(() => Location, location => location.billPicking, { cascade: true, nullable: false })
    @JoinColumn()
    pickingPort: Location;

    @OneToMany(() => CartItem, cartItems => cartItems.bill, { cascade: true, nullable: false })
    items: CartItem[];

    @ManyToOne(() => Shop, shop => shop.bills, { cascade: true })
    shop: Shop;

    @OneToOne(() => Payment, payment => payment.bill)
    payment: Payment;
}
