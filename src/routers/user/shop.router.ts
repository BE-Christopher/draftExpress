import { Router } from "express";
import { userShopController } from "../../controller/user";
import { BaseRouter } from "../interfaces";
const router = Router();

class UserShopRouter implements BaseRouter {
    getRoutes() {
        const {
            registerMyShop,
            followingShop,
            unFollowShop,
        } = userShopController;

        router.post('/', registerMyShop);
        router.post('/:id/following-shop', followingShop);
        router.post('/un-follow-shops', unFollowShop);

        return router;
    };

}
export const userShopRouter = new UserShopRouter();
