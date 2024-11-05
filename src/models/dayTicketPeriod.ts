import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('day_ticket_period')
class DayTicketPeriod extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    date: string;

    @Column({ default: 'CT' })
    type: string;

    @Column({ nullable: true })
    special: string;

    @Column({ nullable: true })
    one: string;

    @Column({ nullable: true })
    two: string;

    @Column({
        type: 'text',
        nullable: true
    })
    three: string;

    @Column({
        type: 'text',
        nullable: true
    })
    four: string;

    @Column({ nullable: true })
    five: string;

    @Column({
        type: 'text',
        nullable: true
    })
    six: string;

    @Column({ nullable: true })
    seven: string;

    @Column({ nullable: true })
    eight: string;
}

export default DayTicketPeriod;