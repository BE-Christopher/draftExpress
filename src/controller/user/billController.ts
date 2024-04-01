import * as bluebirdPromise from 'bluebird';
import { NextFunction, Request, Response } from "express";
import { EBillStatus } from "../../interfaces";
import LocationDataQuery from "../../models/dataQueries/base/Location.base.dataQueries";
import { userBillDataQuery } from "../../models/dataQueries/user";
import { CartItem, User } from "../../models/entities";
import { BaseController } from "../base/base";
import responseHandler from "../base/responseHandler";
import { CartItemDataQuery } from '../../models/dataQueries/base/CartItem.base.dataQueries';
import ShopeBaseDataQuery from '../../models/dataQueries/base/Shop.base.dataQueries';

const billQuery = userBillDataQuery;
const locationQuery = new LocationDataQuery();
const cartItemQuery = new CartItemDataQuery();
const shopQuery = new ShopeBaseDataQuery();

class UserBillController extends BaseController {
    async getAllBill(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                limit,
                page,
                status
            } = req.query;

            const [bills, total] = await billQuery.getAll({
                limit: Number(limit),
                page: Number(page),
                option: {
                    status: status as EBillStatus,
                    author: {
                        id: Number((req.user as User).id)
                    }
                }
            });

            const totalPage = total % Number(limit);
            responseHandler.successHandler(res, {
                bills,
                totalPage,
                currentPage: Number(page)
            });

        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getOneBill(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const result = await billQuery.getOne({
                options: { id: Number(id) }
            });

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async cancelBill(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await billQuery.cancelBill(Number(id));
            responseHandler.successHandler(res, result);

        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async createBill(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                pickingPortId,
                deliveryPortId,
                cartItemList,
                shopId
            } = req.body;

            // calculate total price
            let totalPrice = 0;
            // get All product
            const items = await bluebirdPromise.mapSeries(cartItemList, async (item) => {
                const cartItem = await cartItemQuery.getOne(Number(item));
                totalPrice += Number(cartItem?.product.price);
                return cartItem;
            });

            // get location picking and delivery
            const [
                pickingPort,
                deliveryPort,
                buyingShop,
            ] = await Promise.all([
                locationQuery.getOne({ id: Number(pickingPortId) }),
                locationQuery.getOne({ id: Number(deliveryPortId) }),
                shopQuery.getOneById(Number(shopId))
            ]);

            const newBill = await billQuery.createBill({
                author: req.user as User,
                totalPrice,
                pickingPort: pickingPort as any,
                deliverPort: deliveryPort as any,
                items: items as any,
                shop: buyingShop as any
            });

            responseHandler.successHandler(res, newBill);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async updateBill(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const {
                deliveryPortId,
                removingItems
            } = req.body;

            // check bill status
            const currentBill = await billQuery.getOne({ options: { id: Number(id) } });
            if (!currentBill) {
                this.errorResponse({
                    code: 404,
                    error: `The bill with id ${id} doesn't existed`
                });
            }
            if (currentBill?.status !== EBillStatus.WaitingApprove) {
                this.errorResponse({
                    code: 403,
                    error: `Can't update processed bill`
                });
            }

            // handle update data
            let newDeliveryPort;
            let newItems = [];

            if (deliveryPortId) {
                newDeliveryPort = await locationQuery.getOne({ id: Number(deliveryPortId) });
            }

            if (removingItems) {
                newItems = (currentBill?.items as CartItem[]).filter((item) => item.id in Array(removingItems));
            }

            await billQuery.updateBill(Number(id), {
                ...(deliveryPortId && { deliverPort: newDeliveryPort }),
                ...(removingItems && { items: removingItems })
            });

            responseHandler.successHandler(res, `Success update bill with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const userBillController = new UserBillController();
