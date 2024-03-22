import { Router } from "express";
import { BaseRouter } from "./interfaces";
import { ProductBaseController } from "../controller/base/productController";
const router = Router();

class ProductRouter implements BaseRouter {
    getRoutes() {
        const {
            getList,
            getOne
        } = new ProductBaseController();

        router.get('/', getList);
        router.get('/:id', getOne);

        return router;
    };
}
export const productRouter = new ProductRouter();
