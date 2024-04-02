import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { User } from "./User";

@Entity({ name: 'card_wallets' })
export class CardWallet extends BaseEntity {
    @Column({ nullable: false })
    cardNumber: string;

    @Column({ nullable: false })
    bankId: number;

    @Column({ nullable: true })
    csv: number;

    @Column({ nullable: false, default: false })
    isDisable: boolean;

    @ManyToOne(() => User, user => user.cards, { cascade: true, nullable: true })
    author: User;
}
