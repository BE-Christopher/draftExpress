import { Repository } from "typeorm";
import MicroData from "../models/microData";
import AppDataSource from "../models/DataSource";


class MicroDataRepository {
    private repo: Repository<MicroData>;

    constructor() {
        this.repo = AppDataSource.getRepository(MicroData);
    }

    async initOne(payload: Partial<MicroData>) {
        const newItem = await this.repo.save(payload);
        return newItem;
    }
}

export default new MicroDataRepository();