import { Router } from "express";
import { BaseRouter } from "./interfaces";
import demoRouter from "./demo.router";
import toolRouter from "./tool.router";

const router = Router();

class IRouters implements BaseRouter {
    getRoutes() {
        // use root router
        router.use('/demo', demoRouter.getRoutes());
        router.use('/tool', toolRouter.getRoutes());

        return router;
    }
}

export default new IRouters();
