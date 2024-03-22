import UserDataQuery, { IUserDataQuery } from "../base/User.base.dataQueries";

interface IBuyerUserQuery extends IUserDataQuery { }

class BuyerUserDataQuery extends UserDataQuery implements IBuyerUserQuery { }

export default new BuyerUserDataQuery();
