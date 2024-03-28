import { Router } from "express";
import { BaseRouter } from "./interfaces";
import { userLocationController } from "../controller/user";
const router = Router();

class LocationRouter implements BaseRouter {
    getRoutes() {
        const {
            getAll,
            create,
            getOne,
            update,
            hardDelete,
            softDelete,
        } = userLocationController;

        router.get('/', getAll);
        router.get('/:id', getOne);
        router.post('/', create);
        router.put('/:id', update);
        router.delete('/:id/disable', softDelete);
        router.delete('/:id/remove', hardDelete);

        return router;
    };
}
export const locationRouter = new LocationRouter();
