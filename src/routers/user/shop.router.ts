import { Router } from "express";
import { userShopController } from "../../controller/user";
import { BaseRouter } from "../interfaces";
const router = Router();

class UserShopRouter implements BaseRouter {
    getRoutes() {
        const { registerMyShop } = userShopController;

        router.post('/', registerMyShop);

        return router;
    };
}
export const userShopRouter = new UserShopRouter();
