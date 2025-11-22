import axios, { type InternalAxiosRequestConfig } from "axios";
import type { Profile } from "../types/auth.types";

const USER_URL = import.meta.env.VITE_USER_API_URL;

export const userInstance = axios.create({
  baseURL: USER_URL,
  timeout: 10000,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  if (token) {
    accessToken = token;
  }
};

userInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export async function getProfile(): Promise<Profile> {
  return (await userInstance.get("/profile")).data;
}

export async function signOut(): Promise<number> {
  return (await userInstance.post("/logout")).status;
}
