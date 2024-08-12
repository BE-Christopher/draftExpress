import { Router } from "express";
import { BaseRouter } from "./interfaces";
import puppeteerController from "../controller/puppeteer.controller";

const router = Router();

class ToolRouter implements BaseRouter {
    getRoutes() {
        router.post('/', puppeteerController.puppeteerRunning);

        return router;
    };
}
export default new ToolRouter();
