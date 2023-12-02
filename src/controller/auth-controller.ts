import { Request, Response, NextFunction } from "express";
import authService from "../service/auth-service";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = req.body;
    const result = await authService.register(request);

    res.status(200).json({
      code: 200,
      message: "Register success",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = req.body;
    const { access_token, refresh_token } = await authService.login(request);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      code: 200,
      message: "Login success",
      data: {
        token: access_token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refresh_token;
    const result = await authService.refreshToken(token);

    res.status(200).json({
      code: 200,
      message: "Refresh token success",
      data: {
        token: result?.access_token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username = req.user?.username as string;

    await authService.logout(username);

    res.clearCookie("refresh_token");

    res.status(200).json({
      code: 200,
      message: "Logout success",
      data: "You have successfully logged out",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
};
