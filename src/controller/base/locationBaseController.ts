import { NextFunction, Request, Response } from "express";
import { FindOptionsWhere } from "typeorm";
import { ELocationType } from "../../interfaces/Location";
import LocationDataQuery from "../../models/dataQueries/base/Location.base.dataQueries";
import UserDataQuery from "../../models/dataQueries/base/User.base.dataQueries";
import { Location, User } from "../../models/entities";
import { BaseController } from "./base";
import responseHandler from "./responseHandler";

const locationDataQuery = new LocationDataQuery();

export default class LocationBaseController extends BaseController {
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
                ...(address && { address: String(address) }),
                ...(country && { country: String(country) }),
                ...(district && { district: String(district) }),
                ...(street && { street: String(street) }),
                ...(ward && { ward: String(ward) }),
                user: {
                    ...(userId && { id: Number(userId) }),
                }
            };
            const result = await locationDataQuery.getAll(queryCondition);

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
            const result = await locationDataQuery.getOne(queryCondition);
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
                userId,
                locationType,
                isPickUpPoint,
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
            const newLocation = await locationDataQuery.createOne(
                {
                    address: String(address),
                    street: String(street),
                    district: String(district),
                    ward: String(ward),
                    country: String(country),
                    user: currentUser as User,
                    isPickUpPoint,
                    locationType: locationType as ELocationType,
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
                locationType,
                isPickUpPoint,
            } = req.body;
            const { id } = req.params;

            // check is location existed
            const currentLocation = await locationDataQuery.getOne({ id: Number(id) });
            if (!currentLocation) {
                this.errorResponse({ code: 404, error: this.errorMessage.doesExisted(`The location with id: ${id}`) });
            }

            await locationDataQuery.updateLocation(
                Number(id),
                {
                    address,
                    street,
                    district,
                    ward,
                    country,
                    locationType,
                    isPickUpPoint
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

            await locationDataQuery.softDeleteLocation(Number(id));

            responseHandler.successHandler(res, `Success disable location with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }

    async hardDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await locationDataQuery.hardDeleteLocation(Number(id));

            responseHandler.successHandler(res, `Success disable location with id: ${id}`);
        } catch (error) {
            console.log('>>>>>>>>>>', error);
            responseHandler.errorHandler(res, error);
        }
    }
}
