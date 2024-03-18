import LocationBaseDataQueries, { ILocationDataQuery } from "../base/Location.base.dataQueries";

export interface IUserLocationDataQuery extends ILocationDataQuery {
}

class UserLocationDataQuery extends LocationBaseDataQueries implements IUserLocationDataQuery { }

export default new UserLocationDataQuery();
