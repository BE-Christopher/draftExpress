import * as moment from 'moment';
import { BeforeInsert, BeforeUpdate, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @BeforeInsert()
    insertCreated() {
        this.createdAt = moment('YYYY-MM-DD').toDate();
    }

    @BeforeUpdate()
    insertUpdated() {
        this.updatedAt = moment('YYYY-MM-DD').toDate();
    }
}
