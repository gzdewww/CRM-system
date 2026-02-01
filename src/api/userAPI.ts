import axios, {
  AxiosError,
  isAxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { getRefreshToken, hasRefreshToken } from "../helpers/storeTokenLocal";
import type { ApiError } from "../store/utils/asyncUtils";
import type { Profile } from "../types/auth.types";
import { refresh } from "./authAPI";

let accessToken = "";

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string) => (accessToken = token);
export const removeAccessToken = () => (accessToken = "");

const USER_URL = import.meta.env.VITE_USER_API_URL;
const ADMIN_URL = import.meta.env.VITE_ADMIN_API_URL;

export const userInstance = axios.create({
  baseURL: USER_URL,
  timeout: 10000,
});

export const adminInstance = axios.create({
  baseURL: ADMIN_URL,
  timeout: 10000,
});

const handleAuthError = async (error: AxiosError) => {
  const originalConfig = error.request.config;
  if (
    error.response?.status === 401 &&
    originalConfig &&
    !originalConfig._retry
  ) {
    originalConfig._retry = true;

    if (hasRefreshToken()) {
      try {
        await refresh({ refreshToken: getRefreshToken() });
        return userInstance(originalConfig);
      } catch (refreshError) {
        return Promise.reject(refreshError as ApiError);
      }
    }

    return userInstance(originalConfig);
  }
};

userInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error),
);

adminInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error),
);

userInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("interceptor");
    if (isAxiosError(error)) {
      handleAuthError(error);
    }
    return Promise.reject(error);
  },
);

adminInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("interceptor");
    if (isAxiosError(error)) {
      handleAuthError(error);
    }
    return Promise.reject(error);
  },
);

export async function getProfile(): Promise<Profile> {
  return (await userInstance.get("/profile")).data;
}

export async function signOut(): Promise<number> {
  return (await userInstance.post("/logout")).status;
}

export async function getUsers(): Promise<Profile[]> {
  return (await adminInstance.get("/users")).data;
}
