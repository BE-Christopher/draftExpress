import { Router } from "express";
import { auth } from "../controller/base/auth";
import { BaseRouter } from "./interfaces";
const router = Router();

class AuthRouter implements BaseRouter {
    getRoutes() {
        router.post('/login', auth.login);
        router.post('/register', auth.register);
        router.get('/verified-user', auth.verifyUser);
        router.post('/forgot-password', auth.forgotPassword);
        router.put('/reset-password', auth.resetPassword);

        return router;
    };
}
export default new AuthRouter();
