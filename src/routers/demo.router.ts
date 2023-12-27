import { Router } from "express";
import { BaseRouter } from "./interfaces";
import demoController from "./../controller/demo.controller";

const router = Router();

class DemoRouter implements BaseRouter {
    getRoutes() {
        router.get('/', demoController.getDemo);

        return router;
    };
}
export default new DemoRouter();
