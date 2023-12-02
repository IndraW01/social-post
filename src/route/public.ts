import { Router } from "express";
import authController from "../controller/auth-controller";

const publicApi: Router = Router();

// Auth route
publicApi.post("/auth/register", authController.register);
publicApi.post("/auth/login", authController.login);
publicApi.post("/auth/refresh-token", authController.refreshToken);

export default publicApi;
