import { Repository } from "typeorm";
import AppDataSource from "../models/DataSource";
import DayTicketPeriod from "../models/dayTicketPeriod";


class DayTickerRepository {
    private repo: Repository<DayTicketPeriod>;

    constructor() {
        this.repo = AppDataSource.getRepository(DayTicketPeriod);
    }

    public saveItem(payload: Partial<DayTicketPeriod>) {
        return this.repo.save(payload);
    }

}

export default DayTickerRepository;