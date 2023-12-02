import { Router } from "express";
import authController from "../controller/auth-controller";
import authMiddleware from "../middleware/auth-middleware";
import userController from "../controller/user-controller";

const privateApi: Router = Router();

// Use auth middleware
privateApi.use(authMiddleware);

// Auth route
privateApi.delete("/auth/logout", authController.logout);

// User route
privateApi.get("/users/current", userController.current);

export default privateApi;
