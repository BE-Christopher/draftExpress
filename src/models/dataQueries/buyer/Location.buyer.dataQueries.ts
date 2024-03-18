import LocationBaseDataQueries, { ILocationDataQuery } from "../base/Location.base.dataQueries";

export interface IBuyerLocationDataQuery extends ILocationDataQuery {
}

class BuyerLocationDataQuery extends LocationBaseDataQueries implements IBuyerLocationDataQuery { }

export default new BuyerLocationDataQuery();
