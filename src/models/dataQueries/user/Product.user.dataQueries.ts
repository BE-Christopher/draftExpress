import { IProductBaseDataQuery, ProductBaseDataQuery } from "../base/Product.base.dataQueries";

export interface IUserProductDataQuery extends IProductBaseDataQuery { }

class UserProductDataQuery extends ProductBaseDataQuery implements IUserProductDataQuery { }

export const userProductDataQuery = new UserProductDataQuery();
