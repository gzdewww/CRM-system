import axios, {
  AxiosError,
  isAxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getRefreshToken,
  hasRefreshToken,
  removeRefreshToken,
} from "../helpers/storeTokenLocal";
import type { ApiError } from "../store/utils/asyncUtils";
import type {
  UserFilters,
  UserRequest,
  UserRolesRequest,
} from "../types/admin.types";
import type { MetaResponse, Profile, Role } from "../types/auth.types";
import { refresh } from "./authAPI";

let accessToken = "";

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string) => (accessToken = token);
export const removeAccessToken = () => (accessToken = "");

const USER_URL = import.meta.env.VITE_USER_API_URL;
const ADMIN_URL = import.meta.env.VITE_ADMIN_API_URL;

const createInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  }, undefined);

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (isAxiosError(error)) {
        const originalConfig = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          error.response?.status === 401 &&
          originalConfig &&
          !originalConfig._retry
        ) {
          originalConfig._retry = true;

          if (hasRefreshToken()) {
            try {
              await refresh({ refreshToken: getRefreshToken() });
              originalConfig.headers.Authorization = `Bearer ${getAccessToken()}`;
              return instance(originalConfig);
            } catch (refreshError) {
              console.error("Токен не был обновлён:", refreshError);
              removeAccessToken();
              removeRefreshToken();
              return Promise.reject(refreshError as ApiError);
            }
          }
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const userInstance = createInstance(USER_URL);
export const adminInstance = createInstance(ADMIN_URL);

export async function getProfile(): Promise<Profile> {
  return (await userInstance.get("/profile")).data;
}

export async function signOut(): Promise<number> {
  return (await userInstance.post("/logout")).status;
}

// ADMIN FUNCTIONS

export async function updateProfile(request: UserRequest): Promise<Profile> {
  return (await userInstance.put("/profile", request)).data;
}

export async function getProfileById(id: number): Promise<Profile> {
  return (await adminInstance.get(`/users/${id}`)).data;
}

export async function blockUser(id: number): Promise<Profile> {
  return (await adminInstance.post(`/users/${id}/block`)).data;
}

export async function unblockUser(id: number): Promise<Profile> {
  return (await adminInstance.post(`/users/${id}/unblock`)).data;
}

export async function setRoles(id: number, roles: Role[]): Promise<Profile> {
  const request: UserRolesRequest = { roles };
  return (await adminInstance.put(`/users/${id}/rights`, request)).data;
}

export async function deleteUser(id: number): Promise<void> {
  await adminInstance.delete(`/users/${id}`);
}

export async function updateUserById(
  id: number,
  request: UserRequest,
): Promise<Profile> {
  return (await adminInstance.put(`/users/${id}`, request)).data;
}

export async function getUsers(
  filters: UserFilters,
): Promise<MetaResponse<Profile>> {
  const users = (
    await adminInstance.get("/users", {
      params: {
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        isBlocked: filters.isBlocked,
        filter: filters.isBlocked,
        limit: filters.limit,
        page: filters.page,
      },
    })
  ).data;
  return users;
}
