import { Router } from "express";
import { BaseRouter } from "./interfaces";
import { IndustryBaseController } from "../controller/base/industryHandler";
const router = Router();

class IndustryRouter implements BaseRouter {
    getRoutes() {
        const {
            getList
        } = new IndustryBaseController()

            router.get('/', getList)
        return router;
    };
}
export const industryRouter = new IndustryRouter();
