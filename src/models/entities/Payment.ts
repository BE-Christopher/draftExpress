import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { Bill } from "./Bill";
import { EPaymentStatus } from "../../interfaces";


@Entity({ name: 'payment' })
export class Payment extends BaseEntity {
    @Column({ type: 'enum', enum: EPaymentStatus, default: EPaymentStatus.WaitingPaid })
    paidStatus: EPaymentStatus;

    @Column({ nullable: false, unique: true })
    paidCode: string;

    @OneToOne(() => Bill, bill => bill.payment, { cascade: true })
    @JoinColumn()
    bill: Bill;
}
