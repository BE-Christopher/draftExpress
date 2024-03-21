import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { IIndustryDataQuery, IndustryBaseDataQuery } from "../base/Industry.base.dataQueries";
import { Industry } from "../../entities";

interface IAdminIndustryDataQuery extends IIndustryDataQuery {
    addIndustry(payload: DeepPartial<Industry>): Promise<Industry>;
    updateIndustry(id: number, payload: DeepPartial<Industry>): Promise<UpdateResult>;
    softDeleteIndustry(id: number): Promise<UpdateResult>;
    hardDeleteIndustry(id: number): Promise<DeleteResult>;

}

class AdminIndustryDataQuery extends IndustryBaseDataQuery implements IAdminIndustryDataQuery {
    async addIndustry(payload: DeepPartial<Industry>) {
        const newIndustry = await this.industryTb.create(payload);
        return newIndustry;
    }

    updateIndustry(id: number, payload: DeepPartial<Industry>) {
        return this.industryTb.update(id, payload);
    }

    softDeleteIndustry(id: number) {
        return this.industryTb.softDelete(id);
    }

    hardDeleteIndustry(id: number) {
        return this.industryTb.delete(id);
    }
}

export const adminIndustryDataQuery = new AdminIndustryDataQuery();
