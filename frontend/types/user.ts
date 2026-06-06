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

export type DoLoginRequest = {
  email: string;
  password: string;
};

export type LoggedUser = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export interface Creator {
  id: number;
  name: string;
  email: string;
  description?: string;
}