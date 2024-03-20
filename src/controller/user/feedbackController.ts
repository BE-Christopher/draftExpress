import { NextFunction, Request, Response } from "express";
import { FeedbackBaseController } from "../base/feedbackHandler";
import responseHandler from "../base/responseHandler";
import { userFeedbackQuery } from "../../models/dataQueries";
import moment = require("moment");

class UserFeedbackController extends FeedbackBaseController {
    feedbackQuery = userFeedbackQuery;
    async createFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                rating,
                content,
                productId,
                asserts
            } = req.body;

            //  getProduct - wip
            // const currentProduct = await

            // handler assert -wip

            const newFeedback = await this.feedbackQuery.createFeedback({
                rating,
                content,
                author: req.user,
                datePosted: moment().toDate()
            });

            responseHandler.successHandler(res, newFeedback);
        } catch (error) {
            console.log('>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}

export default new UserFeedbackController();
