interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  confirm_password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

export { RegisterRequest, LoginRequest };
