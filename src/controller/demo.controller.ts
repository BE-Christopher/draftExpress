import { Request, Response } from "express";

class DemoController {
    getDemo(req: Request, res: Response) {
        res.send('Access into demoController');
    }
}

export default new DemoController();
