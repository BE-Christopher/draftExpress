import { NextFunction, Request, Response } from "express";
import responseHandler from "./responseHandler";
import { IndustryBaseDataQuery } from "../../models/dataQueries/base/Industry.base.dataQueries";
import { BaseController } from "./base";

const industryQuery = new IndustryBaseDataQuery();

export class IndustryBaseController extends BaseController {

    constructor() {
        super();
    }

    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                limit,
                page,
                name,
                productName
            } = req.query;

            const result = await industryQuery.getAll({
                limit: Number(limit),
                page: Number(page),
                name: String(name) ?? undefined,
                productName: String(productName) ?? undefined
            });

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}
