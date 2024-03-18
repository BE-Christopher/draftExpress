import UserDataQuery, { IUserDataQuery } from "../base/User.base.dataQueries";

interface IUserRoleUserQuery extends IUserDataQuery { }

class UserRoleUserDataQuery extends UserDataQuery implements IUserRoleUserQuery { }

export default new UserRoleUserDataQuery();
