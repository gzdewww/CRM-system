import axios from "axios";
import type {
  AuthData,
  Profile,
  Token,
  TokenRequest,
  UserRegistration,
} from "../types/auth.types";

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL;

const authInstance = axios.create({
  baseURL: AUTH_URL,
  timeout: 10000,
});

export async function signIn(data: AuthData): Promise<Token> {
  const response = await authInstance.post("/signin", data);
  return response.data;
}

export async function signUp(data: UserRegistration): Promise<Profile> {
  return (await authInstance.post("/signup", data)).data;
}

export async function refresh(data: TokenRequest): Promise<Token> {
  const response = await authInstance.post("/refresh", data);
  return response.data;
}
