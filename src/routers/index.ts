import { Router } from "express";
import { BaseRouter } from "./interfaces";
import demoRouter from "./demo.router";

const router = Router();

class IRouters implements BaseRouter {
    getRoutes() {
        // use root router
        router.use('/demo', demoRouter.getRoutes());

        return router;
    }
}

export default new IRouters();
