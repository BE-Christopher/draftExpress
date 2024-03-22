import { Router } from "express";
import { adminShopController } from "../../controller/admin";
import { BaseRouter } from "../interfaces";
const router = Router();

class AdminShopRouter implements BaseRouter {
    getRoutes() {

        const { disableOrHardDeleteShop } = adminShopController;

        router.delete('/:id', disableOrHardDeleteShop);

        return router;
    };
}
export const adminShopRouter = new AdminShopRouter();
