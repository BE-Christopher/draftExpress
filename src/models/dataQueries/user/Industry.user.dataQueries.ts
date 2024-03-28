import { IIndustryDataQuery, IndustryBaseDataQuery } from "../base/Industry.base.dataQueries";

interface IBuyerIndustryDataQuery extends IIndustryDataQuery { }

class BuyerIndustryDataQuery extends IndustryBaseDataQuery implements IBuyerIndustryDataQuery { }

export const buyerIndustryDataQuery = new BuyerIndustryDataQuery();
