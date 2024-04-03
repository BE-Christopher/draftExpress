import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/base";
import responseHandler from "../base/responseHandler";
import { adminBillDataQuery } from "../../models/dataQueries";
import { EBillStatus, EPaymentStatus } from "../../interfaces";
import { PaymentBaseDataQuery } from "../../models/dataQueries/base/Payment.base.dataQueries";

const billQuery = adminBillDataQuery;
const paymentQuery = new PaymentBaseDataQuery();

enum AdminConfirmCharge {
    Cancel = 'Cancel',
    Confirm = 'Confirm'
}

class AdminBillController extends BaseController {
    async getAllBill(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                limit,
                page,
                shopId,
                status,
                paidStatus
            } = req.query;

            const [bills, total] = await billQuery.getList({
                limit: Number(limit),
                page: Number(page),
                option: {
                    shop: {
                        id: Number(shopId)
                    },
                    status: status as EBillStatus,
                    payment: {
                        paidStatus: paidStatus as EPaymentStatus
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
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getOneBill(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await billQuery.getOne(Number(id));
            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async confirmCharge(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { type } = req.body;
            // check type
            if (!(String(type) in AdminConfirmCharge)) {
                this.errorResponse({
                    code: 400,
                    error: `The type inCorrect`
                });
            }
            const status = type === AdminConfirmCharge.Confirm ? EPaymentStatus.AdminPaid : EPaymentStatus.Cancel;
            const currentBill = await billQuery.getOne(Number(id));
            if (!currentBill) {
                this.errorResponse({
                    code: 404,
                    error: `The bill with id ${id} doesn't existed`
                });
            }

            await paymentQuery.updatePaymentStatus(Number(currentBill?.payment.id), status);

            responseHandler.successHandler(res, `Confirm charge the bill with id ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const adminBillController = new AdminBillController();
