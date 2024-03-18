import LocationBaseDataQueries, { ILocationDataQuery } from "../base/Location.base.dataQueries";

export interface IAdminLocationDataQuery extends ILocationDataQuery {
}

class AdminLocationDataQuery extends LocationBaseDataQueries implements IAdminLocationDataQuery { }

export default new AdminLocationDataQuery();
