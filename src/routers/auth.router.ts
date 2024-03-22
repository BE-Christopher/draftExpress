import { Router } from "express";
import { BaseRouter } from "./interfaces";
import auth from "../controller/base/auth";
const router = Router();

class AuthRouter implements BaseRouter {
    getRoutes() {
        router.post('/login', auth.login);
        router.post('/register', auth.register);
        router.post('/forgot-password', auth.forgotPassword);
        router.post('/reset-password', auth.resetPassword);

        return router;
    };
}
export default new AuthRouter();
