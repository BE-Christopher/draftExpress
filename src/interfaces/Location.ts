export interface IWard {
    id: number;
    name: string;
}

export interface IDistinct {
    id: number;
    name: string;
    wards: IWard[];
}

export interface IRegion {
    id: number;
    name: string;
    districts: IDistinct[];
}

export interface ICountry {
    id: number;
    name: string;
    regions: IRegion[];
}

export interface ILocation {
    id: number;
    address: string;
    street: string;
    distinct: IDistinct;
    region: IRegion;
    country: ICountry;
}
