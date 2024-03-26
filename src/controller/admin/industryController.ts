import { NextFunction, Request, Response } from "express";
import { adminIndustryDataQuery } from "../../models/dataQueries";
import { IndustryBaseController } from "../base/industryHandler";
import responseHandler from "../base/responseHandler";

export enum DeleteIndustryPayload {
    Hard = 'Hard',
    Soft = 'Soft'
}

const industryQuery = adminIndustryDataQuery;

class AdminIndustryController extends IndustryBaseController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;

            const newIndustry = await industryQuery.addIndustry({
                name
            });

            responseHandler.successHandler(res, newIndustry);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const { id } = req.params;

            await industryQuery.updateIndustry(Number(id), {
                name
            });

            responseHandler.successHandler(res, `Success update industry with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { type } = req.query;

            // check type
            if (!(String(type) in DeleteIndustryPayload)) {
                this.errorResponse({
                    code: 400,
                    error: this.errorMessage.required(type)
                });
            }

            // delete action by type
            if (String(type) === DeleteIndustryPayload.Soft) {
                await adminIndustryDataQuery.softDeleteIndustry(Number(id));
            } else {
                await adminIndustryDataQuery.hardDeleteIndustry(Number(id));
            }

            responseHandler.successHandler(res, `Success delete industry with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}


export const adminIndustryController = new AdminIndustryController();
