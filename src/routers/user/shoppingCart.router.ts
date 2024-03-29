import { Router } from "express";
import { userShoppingCartController } from "../../controller/user";
import { BaseRouter } from "../interfaces";
const router = Router();

class UserShoppingCartRouter implements BaseRouter {
    getRoutes() {
        const {
            initCart,
            addNewItem,
            getListItems,
        } = userShoppingCartController;

        router.post('/', initCart);
        router.put('/add-item', addNewItem);
        router.get('/', getListItems);

        return router;
    };

}
export const userShoppingCartRouter = new UserShoppingCartRouter();
