import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { IIndustryDataQuery, IndustryBaseDataQuery } from "../base/Industry.base.dataQueries";
import { Industry } from "../../entities";
import AppDataSource from "../../data-source";

interface IAdminIndustryDataQuery extends IIndustryDataQuery {
    addIndustry(payload: DeepPartial<Industry>): Promise<Industry>;
    updateIndustry(id: number, payload: DeepPartial<Industry>): Promise<UpdateResult>;
    softDeleteIndustry(id: number): Promise<UpdateResult>;
    hardDeleteIndustry(id: number): Promise<DeleteResult>;

}
const industryTb = AppDataSource.getRepository(Industry);

class AdminIndustryDataQuery extends IndustryBaseDataQuery implements IAdminIndustryDataQuery {
    async addIndustry(payload: DeepPartial<Industry>) {
        const newIndustry = await industryTb.create(payload);
        await industryTb.save(newIndustry);
        return newIndustry;
    }

    updateIndustry(id: number, payload: DeepPartial<Industry>) {
        return industryTb.update(id, payload);
    }

    softDeleteIndustry(id: number) {
        return industryTb.softDelete(id);
    }

    hardDeleteIndustry(id: number) {
        return industryTb.delete(id);
    }
}

export const adminIndustryDataQuery = new AdminIndustryDataQuery();
