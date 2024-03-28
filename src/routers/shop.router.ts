import { Router } from "express";
import { BaseRouter } from "./interfaces";
import { ShopBaseController } from "../controller/base/shop";
const router = Router();

class ShopRouter implements BaseRouter {
    getRoutes() {
        const {
            getAll,
            getOne,
            getAllByIndustry,
        } = new ShopBaseController();

        router.get('/', getAll);
        router.get('/:id', getOne);
        router.get('/:industryId/industry', getAllByIndustry);

        return router;
    };
}
export const shopRouter = new ShopRouter();
