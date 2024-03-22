import { Router } from "express";
import { adminIndustryController } from "../../controller/admin/industryController";
import { BaseRouter } from "../interfaces";
const router = Router();

class AdminIndustryRouter implements BaseRouter {
    getRoutes() {

        router.post('/', adminIndustryController.create);
        router.put('/:id', adminIndustryController.update);
        router.delete('/:id', adminIndustryController.delete);

        return router;
    };
}
export const adminIndustryRouter = new AdminIndustryRouter();
