import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { hasRefreshToken } from "../helpers/storeTokenLocal";
import { refreshThunk } from "../store/slices/auth/authSlice";
import type { ApiError } from "../store/utils/asyncUtils";
import type { Profile } from "../types/auth.types";

const USER_URL = import.meta.env.VITE_USER_API_URL;

export const userInstance = axios.create({
  baseURL: USER_URL,
  timeout: 10000,
});

userInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { store } = await import("../store/store");
    const accessToken = store.getState().auth.token.data?.accessToken;
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

userInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (isAxiosError(error)) {
      const originalConfig = error.request.config;
      if (
        error.response?.status === 401 &&
        originalConfig &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;

        if (hasRefreshToken()) {
          const { store } = await import("../store/store");

          try {
            await store.dispatch(refreshThunk());
            return userInstance(originalConfig);
          } catch (refreshError) {
            return Promise.reject(refreshError as ApiError);
          }
        }

        return userInstance(originalConfig);
      }
    }
    return Promise.reject(error);
  }
);

export async function getProfile(): Promise<Profile> {
  return (await userInstance.get("/profile")).data;
}

export async function signOut(): Promise<number> {
  return (await userInstance.post("/logout")).status;
}
