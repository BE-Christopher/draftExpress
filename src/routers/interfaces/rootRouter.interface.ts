import { Router } from "express";

export interface BaseRouter {
    getRoutes: () => Router;
}
