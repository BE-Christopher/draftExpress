import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { BaseEntity } from "./Base";


@Entity({ name: 'locations' })
export class Location extends BaseEntity {
    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    street: string;

    @Column({ nullable: false })
    district: string;

    @Column({ nullable: false })
    ward: string;

    @Column({ nullable: false })
    country: string;

    @ManyToOne(() => User, user => user.locations)
    user: User;
}
