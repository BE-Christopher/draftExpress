import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/base";
import responseHandler from "../base/responseHandler";
import { userBillDataQuery } from "../../models/dataQueries/user";
import config from "../../config";
import axios from "axios";

const billTb = userBillDataQuery;

class UserPaymentController extends BaseController {
    async generateQr(req: Request, res: Response, next: NextFunction) {
        try {
            const { billId } = req.body;
            const currentBill = await billTb.getOne({ options: { id: Number(billId) } });
            if (!billId) {
                this.errorResponse({
                    code: 404,
                    error: `The Bill with id doesn't existed`
                });
            }

            // call api
            const options = {
                accountNo: config.adminBankAccount,
                accountName: config.adminBankName,
                acqId: config.adminBankBin,
                addInfo: `Charge for bill ${currentBill?.payment.paidCode}`,
                amount: currentBill?.totalPrice,
                template: 'compact'
            };

            const headers = {
                'x-client-id': config.clientId,
                'x-api-key': config.apiKey,
                'Content-Type': 'application/json'
            };

            const result = await axios.post(config.generateQrPath, options, { headers: headers });

            const {
                code,
                data
            } = result.data;
            if (code !== '00') {
                this.errorResponse({
                    code: 400,
                    error: 'Qr error'
                });
            }

            responseHandler.successHandler(res, { qrDataURL: data.qrDataURL });
        } catch (error) {
            console.log('>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const userPaymentController = new UserPaymentController();
