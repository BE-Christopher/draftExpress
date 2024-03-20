import { NextFunction, Request, Response } from "express";
import { FeedbackBaseDataQuery } from "../../models/dataQueries/base/Feedback.base.dataQueries";
import { BaseController } from "./base";
import responseHandler from "./responseHandler";


export class FeedbackBaseController extends BaseController {
    feedbackQuery = new FeedbackBaseDataQuery();

    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                limit,
                page,
                authorId,
                productId,
            } = req.query;

            const result = await this.feedbackQuery.getList({
                limit: Number(limit),
                page: Number(page),
                authorId: Number(authorId),
                productId: Number(productId)
            });

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}
