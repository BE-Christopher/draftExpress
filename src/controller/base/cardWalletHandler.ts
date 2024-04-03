import { NextFunction, Request, Response } from "express";
import { CardWalletBaseDataQuery } from "../../models/dataQueries/base/CardWallet.base.dataQueries";
import { BaseController } from "./base";
import responseHandler from "./responseHandler";
import { User } from "../../models/entities";
import { bankInfo } from "../../constants";
import axios from "axios";
import config from "../../config";

const cardWalletQuery = new CardWalletBaseDataQuery();

enum DisableOrDeleteCard {
    Disable = 'Disable',
    Delete = 'Delete'
}

export class CardWalletBaseController extends BaseController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = req.user as User;
            const result = await cardWalletQuery.getAll(Number(currentUser.id));

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getAllSupportedBank(req: Request, res: Response, next: NextFunction) {
        try {

            responseHandler.successHandler(res, bankInfo);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async createCard(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                bankId,
                cardNumber,
                csv
            } = req.body;

            // check is existed card
            const cardBin = bankInfo.find((item) => item.id = Number(bankId))?.bin;
            if (!cardBin) {
                this.errorResponse({
                    code: 404,
                    error: `Bank not supported`
                });
            }
            const options = {
                method: 'post',
                url: config.checkCardPath,
                headers: {
                    'x-client-id': config.clientId,
                    'x-api-key': config.apiKey,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    bin: cardBin,
                    accountNumber: cardNumber,
                })
            };
            //check late
            // const validCard = await axios(options);
            // console.log("🚀 ~ CardWalletBaseController ~ createCard ~ validCard:", validCard);
            // if (!validCard) {
            //     this.errorResponse({
            //         code: 404,
            //         error: `Invalid card`
            //     });
            // }

            const result = await cardWalletQuery.addCard({
                author: req.user as User,
                bankId: Number(bankId),
                cardNumber: String(cardNumber),
                csv: Number(csv),
            });

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async disableOrRemoveCard(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { type } = req.body;

            // check data type
            if (!(String(type) in DisableOrDeleteCard)) {
                this.errorResponse({
                    code: 401,
                    error: `Incorrect card action type`
                });
            }
            if (String(type) === DisableOrDeleteCard.Delete) {
                await cardWalletQuery.hardDelete(Number(id));
            } else {
                await cardWalletQuery.softDelete(Number(id));
            }

            responseHandler.successHandler(res, `Success ${type} the card with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}
