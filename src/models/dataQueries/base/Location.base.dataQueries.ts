import { DeepPartial, FindOptionsWhere } from "typeorm";
import AppDataSource from "../../data-source";
import { Location } from "../../entities";

export interface ILocationDataQuery {
    getAll(options?: FindOptionsWhere<Location>): Promise<Location[]>;
    getOne(options?: FindOptionsWhere<Location>): Promise<Location | null>;
    createOne(location: DeepPartial<Location>): Promise<Location>;
}

const locationTb = AppDataSource.getRepository(Location);

export default class LocationDataQuery implements ILocationDataQuery {
    constructor() { }

    getAll(options?: FindOptionsWhere<Location>) {
        return locationTb.find({
            where: options,
            relations: {
                user: true
            }
        });
    }

    getOne(options?: FindOptionsWhere<Location>) {
        return locationTb.findOne({ where: options });
    };

    async createOne(location: DeepPartial<Location>) {
        const newLocation = await locationTb.create(location);
        await locationTb.save(newLocation);
        return newLocation;
    }

    updateLocation(id: number, location: DeepPartial<Location>) {
        return locationTb.update(id, location);
    }

    softDeleteLocation(id: number) {
        return locationTb.softDelete(id);
    }

    hardDeleteLocation(id: number) {
        return locationTb.delete(id);
    }

    getLocationTb() {
        return locationTb;
    }
}
