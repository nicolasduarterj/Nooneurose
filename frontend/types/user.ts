export type LoginResponse = {
  token: string;
  name: string;
  isAdmin: boolean;
};

export type CreateUserResponse = {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export type DoLoginRequest = {
  email: string;
  password: string;
};

export type LoggedUser = {
  id: number;
  name: string;
  isAdmin: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};

export interface Creator {
  id: number;
  name: string;
  email: string;
}

export type FormData = {
  name: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
}