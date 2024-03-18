import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";


@Entity({ name: 'locations' })
export class Location {
    @PrimaryColumn()
    id: number;

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
