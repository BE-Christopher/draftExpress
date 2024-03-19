'use strict';

import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EGender, EUserRole } from "../../interfaces/User.baseController";
import { Location } from "./Location";
import { BaseEntity } from "./Base";

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
}
