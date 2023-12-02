import prisma from "../application/database";
import bcrypt from "bcrypt";
import ResponseError from "../error/response-error";
import { LoginRequest, RegisterRequest } from "../interface/auth-interface";
import {
  authLoginValidation,
  authLogoutValidation,
  authRegisterValidation,
} from "../validation/auth-validation";
import validation from "../validation/validation";
import jwt from "jsonwebtoken";
import logger from "../application/logger";

const getUserWithUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};

const createTokenJWT = (user: any, expired: string) => {
  if (process.env.JWT_SCREET_KEY) {
    return jwt.sign(
      {
        name: user.name,
        username: user.username,
      },
      process.env.JWT_SCREET_KEY,
      {
        expiresIn: expired,
      }
    );
  } else {
    logger.error("Screet ket not found");
  }
};

const register = async (request: RegisterRequest) => {
  // Cek validasi request
  request = validation(authRegisterValidation, request);

  // Cek apakah username sudah ada
  const userExist = await getUserWithUsername(request.username);

  if (userExist) {
    throw new ResponseError(401, "Username is already used");
  }

  // Bcrypt password
  request.password = await bcrypt.hash(request.password, 10);

  // create user
  return prisma.user.create({
    data: {
      name: request.name,
      username: request.username,
      password: request.password,
    },
    select: {
      id: true,
      name: true,
      username: true,
      password: true,
    },
  });
};

const login = async (request: LoginRequest) => {
  // Cek validasi request
  request = validation(authLoginValidation, request);

  // Cek apakah user  ada
  const user = await getUserWithUsername(request.username);

  if (!user) {
    throw new ResponseError(401, "Incorrect email or password");
  }

  // Cek apakah passwordnya benar
  const checkPassword = await bcrypt.compare(request.password, user.password);

  if (!checkPassword) {
    throw new ResponseError(401, "Incorrect email or password");
  }

  // Buat tokennya
  const access_token = createTokenJWT(user, "20s");
  const refresh_token = createTokenJWT(user, "1d");

  // Update tokennya
  await prisma.user.update({
    where: { username: request.username },
    data: { refresh_token: refresh_token },
  });

  return {
    access_token,
    refresh_token,
  };
};

const refreshToken = async (token: any) => {
  // Cek apakah tokennya ada
  if (!token) {
    throw new ResponseError(401, "Token not found");
  }

  // Cek apakah tokennya ada di database user
  const user = await prisma.user.findFirst({
    where: { refresh_token: token },
  });

  if (!user) {
    throw new ResponseError(401, "User token not found");
  }

  // Decode jwt refresh token
  if (process.env.JWT_SCREET_KEY) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SCREET_KEY);

      // Jika ada refresh tokennya
      const access_token = createTokenJWT(decode, "20s");

      return {
        access_token,
      };
    } catch (e) {
      // Jika refresh tokennya expired Update Refresh tokennya menjadi null
      await prisma.user.update({
        where: {
          username: user.username,
        },
        data: {
          refresh_token: null,
        },
      });

      logger.error(e);

      throw new ResponseError(401, "Token is expired");
    }
  }
};

const logout = async (username: string): Promise<void> => {
  username = validation(authLogoutValidation, username);

  // Cek apakah user ada dari email dan token
  const user = await getUserWithUsername(username);

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  // Update Refresh tokennya menjadi null
  await prisma.user.update({
    where: {
      username: username,
    },
    data: {
      refresh_token: null,
    },
  });
};

export default {
  register,
  login,
  refreshToken,
  logout,
};
