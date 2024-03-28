import AppDataSource from "../../data-source";
import { Product } from "../../entities";
import { IProductBaseDataQuery, ProductBaseDataQuery } from "../base/Product.base.dataQueries";

export interface IUserProductDataQuery extends IProductBaseDataQuery { }

const productTB = AppDataSource.getRepository(Product);
class UserProductDataQuery extends ProductBaseDataQuery implements IUserProductDataQuery { }

export const userProductDataQuery = new UserProductDataQuery();
