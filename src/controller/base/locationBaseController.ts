import { FindOptionsWhere } from "typeorm";
import { ICreateLocation, ILocationQuery } from "../../interfaces/Location";
import LocationDataQuery from "../../models/dataQueries/base/Location.base.dataQueries";
import { Location } from "../../models/entities";

export default class LocationBaseController {
    locationDataQuery = new LocationDataQuery();

    async getAll(options?: ILocationQuery) {
        try {
            const queryCondition: FindOptionsWhere<Location> = {
                address: options?.address,
                country: options?.country,
                district: options?.district,
                id: options?.id,
                street: options?.street,
                ward: options?.ward,
                user: {
                    id: options?.userId
                }
            };
            return await this.locationDataQuery.getAll(queryCondition);
        } catch (error) {
            throw error;
        }
    }

    async getOne(options?: ILocationQuery) {
        try {
            const queryCondition: FindOptionsWhere<Location> = {
                address: options?.address,
                country: options?.country,
                district: options?.district,
                id: options?.id,
                street: options?.street,
                ward: options?.ward,
                user: {
                    id: options?.userId
                }
            };
            return await this.locationDataQuery.getOne(queryCondition);
        } catch (error) {
            throw error;
        }
    }

    async create(data: ICreateLocation) {
        try {
            return await this.locationDataQuery.createOne(data);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: ILocationQuery) {
        try {
            const updatingData = {
                address: data?.address,
                country: data?.country,
                district: data?.district,
                id: data?.id,
                street: data?.street,
                ward: data?.ward,
            };

            return await this.locationDataQuery.updateLocation(id, updatingData);
        } catch (error) {
            throw error;
        }
    }

    async softDelete(id: number) {
        try {
            return await this.locationDataQuery.softDeleteLocation(id);
        } catch (error) {
            throw error;
        }
    }

    async hardDelete(id: number) {
        try {
            return await this.locationDataQuery.hardDeleteLocation(id);
        } catch (error) {
            throw error;
        }
    }
}
