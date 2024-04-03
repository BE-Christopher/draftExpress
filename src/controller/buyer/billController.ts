import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/base";
import responseHandler from "../base/responseHandler";
import { buyerBillDataQuery } from "../../models/dataQueries";
import { EBillStatus, EPaymentStatus } from "../../interfaces";

const billQuery = buyerBillDataQuery;

class BuyerBillController extends BaseController {
    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await billQuery.getOne(Number(id));
            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                limit,
                page,
                status,
                shopId,
                paymentStatus,
            } = req.query;
            const [bills, total] = await billQuery.getList({
                limit: Number(limit),
                page: Number(page),
                option: {
                    status: status as EBillStatus,
                    shop: {
                        id: Number(shopId)
                    },
                    payment: {
                        paidStatus: paymentStatus as EPaymentStatus
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
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async approveBill(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // check bill status
            const currentBill = await billQuery.getOne(Number(id));
            if (!currentBill) {
                this.errorResponse({
                    code: 404,
                    error: `The bill with id ${id} doesn't existed`
                });
            }
            if (currentBill?.status !== EBillStatus.WaitingApprove) {
                this.errorResponse({
                    code: 403,
                    error: `Can't update bill processed`
                });
            }

            await billQuery.approvedBill(Number(id));
            responseHandler.successHandler(res, `Success approved bill with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async rejectBill(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // check bill status
            const currentBill = await billQuery.getOne(Number(id));
            if (!currentBill) {
                this.errorResponse({
                    code: 404,
                    error: `The bill with id ${id} doesn't existed`
                });
            }
            if (currentBill?.status !== EBillStatus.WaitingApprove) {
                this.errorResponse({
                    code: 403,
                    error: `Can't update bill processed`
                });
            }

            await billQuery.rejectBill(Number(id));
            responseHandler.successHandler(res, `Success reject bill with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

}

export const buyerBillController = new BuyerBillController();
