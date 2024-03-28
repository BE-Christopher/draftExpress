import { Router } from "express";
import { BaseRouter } from "../interfaces";
import { userFeedbackController } from "../../controller/user";
const router = Router();

class UserFeedbackRouter implements BaseRouter {
    getRoutes() {
        const { createFeedback } = userFeedbackController;

        router.post('/', createFeedback);

        return router;
    };
}
export const userFeedbackRouter = new UserFeedbackRouter();
