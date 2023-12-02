import express, { Application } from "express";
import publicApi from "../route/public";
import privateApi from "../route/private";
import errorMiddleware from "../middleware/error-middleware";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create express
const web: Application = express();

// Use middleware express and middleware 3third
web.use(cors());
web.use(express.json());
web.use(fileUpload());
web.use(cookieParser());

// Use public api
web.use("/api", publicApi);

// Use private api
web.use("/api", privateApi);

// Use middleware error
web.use(errorMiddleware);

export default web;
