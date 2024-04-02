import { Router } from "express";
import { BaseRouter } from "../interfaces";
import { userBillController } from "../../controller/user";


const router = Router();

class UserBillRouter implements BaseRouter {
    getRoutes() {

        const {
            cancelBill,
            createBill,
            getAllBill,
            getOneBill,
        } = userBillController;

        router.get('/', getAllBill);
        router.get('/:id', getOneBill);
        router.delete('/:id', cancelBill);
        router.post('/', createBill);

        return router;
    }
}

export const userBillRouter = new UserBillRouter();
