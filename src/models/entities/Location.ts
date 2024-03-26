import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { BaseEntity } from "./Base";
import { ELocationType } from "../../interfaces";


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

    @Column({ nullable: false, name: 'location_type', type: 'enum', enum: ELocationType, default: ELocationType.Home })
    locationType: ELocationType;

    @Column({ nullable: false, default: false, name: 'is_pick_up_point' })
    isPickUpPoint: boolean;

    @ManyToOne(() => User, user => user.locations)
    user: User;
}
