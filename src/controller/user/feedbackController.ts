import { NextFunction, Request, Response } from "express";
import { FeedbackBaseController } from "../base/feedbackHandler";
import responseHandler from "../base/responseHandler";
import { userFeedbackQuery, userProductDataQuery } from "../../models/dataQueries/user";
import moment = require("moment");
import { Product } from "../../models/entities";

const feedbackQuery = userFeedbackQuery;
const productQuery = userProductDataQuery;
class UserFeedbackController extends FeedbackBaseController {
    async createFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                rating,
                content,
                productId,
                asserts
            } = req.body;

            //  getProduct
            const currentProduct = await productQuery.getOneProduct(Number(productId));
            if (!currentProduct) {
                this.errorResponse({
                    code: 404,
                    error: `The product with id: ${productId} doesn't existed`
                });
            }
            // handler assert -wip

            const newFeedback = await feedbackQuery.createFeedback({
                rating,
                content,
                author: req.user,
                datePosted: moment().toDate(),
                product: currentProduct as Product
            });

            responseHandler.successHandler(res, newFeedback);
        } catch (error) {
            console.log('>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export const userFeedbackController = new UserFeedbackController();
