import { Router } from "express";
import { BaseRouter } from "./interfaces";
import midasController from "../controller/midas.controller";

const router = Router();

class MidasRouter implements BaseRouter {
    getRoutes() {
        router.post('/clock-angle', midasController.clockAngle);
        router.post('/remote-associate', midasController.remoteAssociate);
        router.post('/snack-and-ladders', midasController.snackAndLadder);
        router.post('/dimension-trip', midasController.dimensionTrip);

        return router;
    };
}

export default new MidasRouter();
