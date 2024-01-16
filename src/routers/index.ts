import { Router } from "express";
import { BaseRouter } from "./interfaces";
import demoRouter from "./demo.router";
import midasRouter from "./midas.router";

const router = Router();

class IRouters implements BaseRouter {
    getRoutes() {
        // use root router
        router.use('/demo', demoRouter.getRoutes());
        router.use('/midas', midasRouter.getRoutes());

        return router;
    }
}

export default new IRouters();
