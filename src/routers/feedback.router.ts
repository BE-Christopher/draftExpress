import { Router } from "express";
import { BaseRouter } from "./interfaces";
import { FeedbackBaseController } from "../controller/base/feedbackHandler";
const router = Router();

class FeedbackRouter implements BaseRouter {
    getRoutes() {
        const {
            getList
        } = new FeedbackBaseController();

        router.get('/', getList);

        return router;
    };
}
export const feedbackRouter = new FeedbackRouter();
