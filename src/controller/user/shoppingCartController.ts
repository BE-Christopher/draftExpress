import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/base";
import responseHandler from "../base/responseHandler";
import { UserShoppingCartDataQuery } from "../../models/dataQueries/user";
import { Product, ProductOptions, User } from "../../models/entities";
import { EUserRole } from "../../interfaces";
import UserDataQuery from "../../models/dataQueries/base/User.base.dataQueries";
import { ProductBaseDataQuery } from "../../models/dataQueries/base/Product.base.dataQueries";
import { ProductOptionBaseDataQuery } from "../../models/dataQueries/base/ProductOption.base.dataQueries";

const shoppingCartQuery = new UserShoppingCartDataQuery();
const userQuery = new UserDataQuery();
const productQuery = new ProductBaseDataQuery();
const productOptionDataQuery = new ProductOptionBaseDataQuery();

class UserShoppingCartController extends BaseController {
    async initCart(req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = await userQuery.getOne({ options: { id: Number((req.user as User).id) } });

            if (!currentUser) {
                this.errorResponse({
                    code: 404,
                    error: `the User doesn't existed`
                });
            }
            if (currentUser?.role !== EUserRole.User) {
                this.errorResponse({
                    code: 401,
                    error: `Invalid role`
                });
            }

            const result = await shoppingCartQuery.initCart(currentUser as User);

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async addNewItem(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                optionId,
                productId,
                cartId,
                quantity
            } = req.body;

            // get relations data
            const [chooseProduct, chooseOption] = await Promise.all([
                productQuery.getOneProduct(Number(productId)),
                productOptionDataQuery.getOne({ id: Number(optionId) })
            ]);

            const result = await shoppingCartQuery.addNewCartItem({
                cartId,
                chooseOption: chooseOption as ProductOptions,
                product: chooseProduct as Product,
                quantity: Number(quantity)
            });

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getListItems(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                id,
                limit,
                page,
            } = req.query;

            const [cartItems, total] = await shoppingCartQuery.getListCartItems({
                id: Number(id),
                limit: Number(limit),
                page: Number(page)
            });
            const totalPage = total % Number(limit);
            responseHandler.successHandler(res, {
                cartItems,
                totalPage,
                currentPage: Number(page),
            });
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const userShoppingCartController = new UserShoppingCartController();
