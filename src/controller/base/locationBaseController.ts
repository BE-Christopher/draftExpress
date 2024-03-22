import { FindOptionsWhere } from "typeorm";
import { ICreateLocation, ILocationQuery } from "../../interfaces/Location";
import LocationDataQuery from "../../models/dataQueries/base/Location.base.dataQueries";
import { Location, User } from "../../models/entities";
import { BaseController } from "./base";
import responseHandler, { ErrorMessage } from "./responseHandler";
import { NextFunction, Request, Response } from "express";
import UserDataQuery from "../../models/dataQueries/base/User.base.dataQueries";

export default class LocationBaseController extends BaseController {
    locationDataQuery = new LocationDataQuery();

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                address,
                country,
                district,
                street,
                ward,
                userId
            } = req.query;
            const queryCondition: FindOptionsWhere<Location> = {
                address: String(address) ?? undefined,
                country: String(country) ?? undefined,
                district: String(district) ?? undefined,
                street: String(street) ?? undefined,
                ward: String(ward) ?? undefined,
                user: {
                    id: Number(userId) ?? undefined
                }
            };
            const result = await this.locationDataQuery.getAll(queryCondition);

            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const queryCondition: FindOptionsWhere<Location> = {
                address: String(req.query?.address),
                country: String(req.query?.country),
                district: String(req.query?.district),
                id: Number(req.query?.id),
                street: String(req.query?.street),
                ward: String(req.query?.ward),
                user: {
                    id: Number(req.query?.userId)
                }
            };
            const result = await this.locationDataQuery.getOne(queryCondition);
            responseHandler.successHandler(res, result);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                address,
                street,
                district,
                ward,
                country,
                userId
            } = req.body;

            //  case invalid user
            const userQuery = new UserDataQuery();
            const currentUser = await userQuery.getOne({ options: { id: Number(userId) } });
            if (!currentUser) {
                this.errorResponse({
                    code: 404,
                    error: this.errorMessage.isDeleted(`The user with id: ${userId}`)
                });
            }
            const newLocation = await this.locationDataQuery.createOne(
                {
                    address,
                    street,
                    district,
                    ward,
                    country,
                    user: currentUser as User
                }
            );
            responseHandler.successHandler(res, newLocation);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                address,
                street,
                district,
                ward,
                country,
            } = req.body;
            const { id } = req.params;

            // check is location existed
            const currentLocation = await this.locationDataQuery.getOne({ id: Number(id) });
            if (!currentLocation) {
                this.errorResponse({ code: 404, error: this.errorMessage.doesExisted(`The location with id: ${id}`) });
            }

            await this.locationDataQuery.updateLocation(
                Number(id),
                {
                    address,
                    street,
                    district,
                    ward,
                    country
                }
            );
            responseHandler.successHandler(res, `Success update location with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async softDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await this.locationDataQuery.softDeleteLocation(Number(id));

            responseHandler.successHandler(res, `Success disable location with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async hardDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await this.locationDataQuery.hardDeleteLocation(Number(id));

            responseHandler.successHandler(res, `Success disable location with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}
