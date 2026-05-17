export type LoginResponse = {
  token: string;
  name: string;
};

export type CreateUserResponse = {
  id: number;
  name: string;
  email: string;
  password: string;
};