import { NextFunction, Request, Response, Router } from "express";
import { BaseRouter } from "./interfaces";
import demoController from "./../controller/demo.controller";
import { realTimeService } from "../controller/realTime";

const router = Router();

class DemoRouter implements BaseRouter {
    getRoutes() {
        router.get('/join-chanel', async (req: Request, res: Response, next: NextFunction) => {
            await realTimeService.sendData({
                chanel: 'demo',
                data: 'demo'
            });

            res.status(200).send('success');
        });

        return router;
    };
}
export default new DemoRouter();
