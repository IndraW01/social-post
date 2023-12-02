import { Request, Response, NextFunction } from "express";
import userService from "../service/user-service";

const current = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.user?.username as string;
    const result = await userService.current(username);

    res.status(200).json({
      code: 200,
      message: "Success get current user",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  current,
};
