import { Router } from "express";
import { BaseRouter } from "../interfaces";
import { buyerBillController } from "../../controller/buyer";
const router = Router();

class BuyerBillRouter implements BaseRouter {
    getRoutes() {
        const {
            approveBill,
            rejectBill,
            getOne,
            getAll,
        } = buyerBillController;

        router.get('/', getAll);
        router.get('/:id', getOne);
        router.delete('/:id', rejectBill);
        router.put('/:id', approveBill);

        return router;
    };
}
export const buyerBillRouter = new BuyerBillRouter();
