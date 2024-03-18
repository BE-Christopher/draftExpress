import { DeepPartial, FindOptionsRelations, FindOptionsWhere, UpdateResult } from "typeorm";
import AppDataSource from "../../data-source";
import { User } from "../../entities";

type getUserQuery = {
    options: FindOptionsWhere<User>,
    relations: FindOptionsRelations<User>;
};

type updateUserPayload = {
    id: number,
    updatingData: DeepPartial<User>;
};

export interface IUserDataQuery {
    getAll(payload: getUserQuery): Promise<User[]>;
    getOne(payload: getUserQuery): Promise<User | null>;
    update(payload: updateUserPayload): Promise<UpdateResult>;
    create(payload: DeepPartial<User>): Promise<User>;
}

const userTb = AppDataSource.getRepository(User);

export default class UserDataQuery implements IUserDataQuery {
    constructor() { }

    getAll(payload: getUserQuery) {
        const { options, relations } = payload;
        return userTb.find({
            where: options,
            relations: relations
        });
    }

    getOne(payload: getUserQuery) {
        const { options, relations } = payload;
        return userTb.findOne({
            where: options,
            relations: relations
        });
    }

    update(payload: updateUserPayload) {
        const { id, updatingData } = payload;
        return userTb.update(id, updatingData);
    }

    async create(payload: DeepPartial<User>) {
        const newUser = await userTb.create(payload);
        await userTb.save(newUser);

        return newUser;
    }
}
