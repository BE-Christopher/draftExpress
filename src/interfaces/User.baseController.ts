import { ILocation } from "./Location";

export enum EGender {
    Male = 'Male',
    Female = 'Female',
    Unknown = 'Unknown'
}

export enum EUserRole {
    Admin = 'Admin',
    Buyer = 'Buyer',
    User = 'User'
}

export interface IBaseUser {
    id: number;
    name: string;
    email: string;
    password?: string;
    personalId?: string;
    location: ILocation;
    birthDate: Date;
    age: number;
    gender: EGender;
    role: EUserRole;
    phone: string;
    isVerified: boolean;
    isDeleted: boolean;
}
