import { Router } from "express";
import { BaseRouter } from "../interfaces";
import { adminProductController } from "../../controller/admin";
const router = Router();

class AdminProductRouter implements BaseRouter {
    getRoutes() {
        const { deleteProduct } = adminProductController;

        router.delete('/:id', deleteProduct);

        return router;
    };
}
export const adminProductRouter = new AdminProductRouter();
