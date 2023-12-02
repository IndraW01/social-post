import prisma from "../application/database";
import ResponseError from "../error/response-error";
import { userCurrentValidation } from "../validation/user-validation";
import validation from "../validation/validation";

const current = async (username: string) => {
  // Validasi username
  username = validation(userCurrentValidation, username);

  // Cek apakah usernya ada
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      name: true,
      username: true,
      password: true,
      bio: true,
      image: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
};

export default {
  current,
};
