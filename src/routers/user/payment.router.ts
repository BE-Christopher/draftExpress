import { Router } from "express";
import { BaseRouter } from "../interfaces";
import { userPaymentController } from "../../controller/user";
const router = Router();

class UserPaymentRouter implements BaseRouter {
    getRoutes() {
        const {
            generateQr
        } = userPaymentController;

        router.post('/generate-qr', generateQr);

        return router;
    };

}
export const userPaymentRouter = new UserPaymentRouter();
