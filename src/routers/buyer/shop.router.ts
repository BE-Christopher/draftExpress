import { Router } from "express";
import { BaseRouter } from "../interfaces";
import { buyerShopController } from "../../controller/buyer";
const router = Router();

class BuyerShopRouter implements BaseRouter {
    getRoutes() {
        const {
            closeOrDisableShop,
            getListIndustryInMyStore,
            importNewIndustry,
            removeNewIndustry,
            updateMyStore,
        } = buyerShopController;

        router.put('/:id', updateMyStore);
        router.delete('/:id', closeOrDisableShop);
        router.get('/:id/industry-list', getListIndustryInMyStore);
        router.post('/add-industry', importNewIndustry);
        router.delete('/remove-industry', removeNewIndustry);

        return router;
    };
}
export const buyerShopRouter = new BuyerShopRouter();
