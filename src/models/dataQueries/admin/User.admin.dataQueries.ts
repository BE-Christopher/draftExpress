import UserDataQuery, { IUserDataQuery } from "../base/User.base.dataQueries";

interface IAdminUserQuery extends IUserDataQuery { }

class AdminUserDataQuery extends UserDataQuery implements IAdminUserQuery { }

export default new AdminUserDataQuery();
