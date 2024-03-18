export interface ILocationQuery {
    id?: number;
    address?: string;
    street?: string;
    district?: string;
    ward?: string;
    country?: string;
    userId?: number;
}

export interface ICreateLocation {
    id: number;
    address: string;
    street: string;
    district: string;
    ward: string;
    country: string;
    userId: number;
}
