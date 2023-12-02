import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../application/logger";
import { User } from "../interface/custom-interface";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token in header
  let token = req.get("Authorization");

  // Cek apakah tokennya ada
  if (!token) {
    return res.status(401).json({
      code: 401,
      errors: "Unauthorized",
    });
  }

  if (token.split(" ")[1] == undefined) {
    return res.status(401).json({
      code: 401,
      errors: "Unauthorized",
    });
  }

  // Ambil tokennya split
  token = token.split(" ")[1];

  if (process.env.JWT_SCREET_KEY) {
    try {
      // Decode jwt
      const decode = jwt.verify(
        token,
        process.env.JWT_SCREET_KEY
      ) as JwtPayload;

      // Tambahkan request user loginny
      req.user = {
        name: decode.name,
        username: decode.username,
      };

      next();
    } catch (e) {
      logger.error(e);

      return res.status(401).json({
        code: 401,
        errors: "Unauthorized",
      });
    }
  } else {
    logger.error("Screet key not found");
  }
};

export default authMiddleware;
