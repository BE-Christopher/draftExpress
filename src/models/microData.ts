import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { awardNumbers, LocationCode, Units } from "../controller/dataProcess";

@Entity({ name: 'micro_data' })
class MicroData extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    number: number;

    @Column({ nullable: false, type: 'enum', enum: LocationCode, default: LocationCode.CT })
    location: LocationCode;

    @Column({ nullable: false, type: 'enum', enum: awardNumbers })
    aware: awardNumbers;

    @Column({ nullable: false, type: 'enum', enum: Units })
    unit: Units;

    @Column({ nullable: false })
    day: number;

    @Column({ nullable: false })
    month: number;

    @Column({ nullable: false })
    year: number;
}

export default MicroData;