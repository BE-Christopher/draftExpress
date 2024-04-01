import { Router } from "express";
import { BaseRouter } from "./interfaces";
import demoRouter from "./demo.router";
import authRouter from "./auth.router";
import authentication from "../middlewares/authentication";
import checkUserRole from "../middlewares/checkUserRole";
import { locationRouter } from "./location.router";
import { industryRouter } from "./industry.router";
import { adminIndustryRouter, adminProductRouter, adminShopRouter } from "./admin";
import { feedbackRouter } from "./feedback.router";
import { userBillRouter, userFeedbackRouter, userShoppingCartRouter, userShopRouter } from "./user";
import { shopRouter } from "./shop.router";
import { buyerProductRouter, buyerShopRouter } from "./buyer";
import { productRouter } from "./product.router";

const router = Router();

class IRouters implements BaseRouter {
    getRoutes() {
        // unauthorize router
        router.use('/demo', demoRouter.getRoutes());
        router.use('/auth', authRouter.getRoutes());

        // authorize router
        router.use('/industry', authentication.authenticate, industryRouter.getRoutes());
        router.use('/feedback', authentication.authenticate, feedbackRouter.getRoutes());
        router.use('/shop', authentication.authenticate, shopRouter.getRoutes());
        router.use('/product', authentication.authenticate, productRouter.getRoutes());

        // user role
        router.use('/user/location', authentication.authenticate, checkUserRole.isUser, locationRouter.getRoutes());
        router.use('/user/feedback', authentication.authenticate, checkUserRole.isUser, userFeedbackRouter.getRoutes());
        router.use('/user/shop', authentication.authenticate, checkUserRole.isUser, userShopRouter.getRoutes());
        router.use('/user/cart', authentication.authenticate, checkUserRole.isUser, userShoppingCartRouter.getRoutes());
        router.use('/user/bill', authentication.authenticate, checkUserRole.isUser, userBillRouter.getRoutes());

        // buyer role
        router.use('/buyer/location', authentication.authenticate, checkUserRole.isBuyer, locationRouter.getRoutes());
        router.use('/buyer/shop', authentication.authenticate, checkUserRole.isBuyer, buyerShopRouter.getRoutes());
        router.use('/buyer/product', authentication.authenticate, checkUserRole.isBuyer, buyerProductRouter.getRoutes());

        // admin role
        router.use('/admin/industry', authentication.authenticate, checkUserRole.isAdmin, adminIndustryRouter.getRoutes());
        router.use('/admin/shop', authentication.authenticate, checkUserRole.isAdmin, adminShopRouter.getRoutes());
        router.use('/admin/product', authentication.authenticate, checkUserRole.isAdmin, adminProductRouter.getRoutes());

        return router;
    }
}

export default new IRouters();
