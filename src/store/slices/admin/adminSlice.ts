import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  blockUser,
  deleteUser,
  getProfileById,
  getUsers,
  removeAccessToken,
  setRoles,
  unblockUser,
  updateUserById,
} from "../../../api/userAPI";
import { removeRefreshToken } from "../../../helpers/storeTokenLocal";
import { initialAdminState } from "../../initialState";
import {
  addAsyncThunkCases,
  type ApiError,
  type AsyncParticle,
} from "../../utils/asyncUtils";
import { refreshThunk } from "../auth/authSlice";
import type { UserFilters, UserRequest } from "../../../types/admin.types";
import type { MetaResponse, Profile, Role } from "../../../types/auth.types";

export interface AdminState {
  usersData: AsyncParticle<MetaResponse<Profile>>;
  selectedUser: AsyncParticle<Profile>;
}

const getErrorPayload = (error: AxiosError): ApiError => {
  const responseData = error.response?.data as { message?: string } | undefined;
  return {
    message: responseData?.message ?? error.message,
    status: error.response?.status,
  };
};

const updateUserInState = (state: AdminState, user: Profile) => {
  if (state.usersData.data) {
    state.usersData.data.data = state.usersData.data.data.map((currentUser) =>
      currentUser.id === user.id ? user : currentUser,
    );
  }

  if (state.selectedUser.data?.id === user.id) {
    state.selectedUser.data = user;
    state.selectedUser.status = "fulfilled";
    state.selectedUser.error = null;
  }
};

const removeUserFromState = (state: AdminState, userId: number) => {
  if (state.usersData.data) {
    state.usersData.data.data = state.usersData.data.data.filter(
      (user) => user.id !== userId,
    );
    state.usersData.data.meta.totalAmount = Math.max(
      0,
      state.usersData.data.meta.totalAmount - 1,
    );
  }

  if (state.selectedUser.data?.id === userId) {
    state.selectedUser.data = null;
    state.selectedUser.status = "idle";
    state.selectedUser.error = null;
  }
};

export const getUsersThunk = createAsyncThunk<
  MetaResponse<Profile>,
  UserFilters,
  { rejectValue: ApiError }
>("admin/getUsers", async (filters, { rejectWithValue, dispatch }) => {
  try {
    return await getUsers(filters);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const refreshResult = await dispatch(refreshThunk());
        if (refreshResult.type === "auth/refresh/fulfilled") {
          return await getUsers(filters);
        }
        removeAccessToken();
        removeRefreshToken();
        return rejectWithValue({
          message: "Сессия истекла",
          status: error.response?.status,
        });
      }
      return rejectWithValue(getErrorPayload(error));
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
});

export const getProfileByIdThunk = createAsyncThunk<
  Profile,
  number,
  { rejectValue: ApiError }
>("admin/getUserById", async (id, { rejectWithValue, dispatch }) => {
  try {
    return await getProfileById(id);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const refreshResult = await dispatch(refreshThunk());
        if (refreshResult.type === "auth/refresh/fulfilled") {
          return await getProfileById(id);
        }
        removeAccessToken();
        removeRefreshToken();
        return rejectWithValue({
          message: "Сессия истекла",
          status: error.response?.status,
        });
      }
      return rejectWithValue(getErrorPayload(error));
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
});

export const updateUserByIdThunk = createAsyncThunk<
  Profile,
  { id: number; request: UserRequest },
  { rejectValue: ApiError }
>(
  "admin/updateUserById",
  async ({ id, request }, { rejectWithValue, dispatch }) => {
  try {
    return await updateUserById(id, request);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const refreshResult = await dispatch(refreshThunk());
        if (refreshResult.type === "auth/refresh/fulfilled") {
          return await updateUserById(id, request);
        }
        removeAccessToken();
        removeRefreshToken();
        return rejectWithValue({
          message: "Сессия истекла",
          status: error.response?.status,
        });
      }
      return rejectWithValue(getErrorPayload(error));
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
  },
);

export const setUserRolesThunk = createAsyncThunk<
  Profile,
  { id: number; roles: Role[] },
  { rejectValue: ApiError }
>(
  "admin/setUserRoles",
  async ({ id, roles }, { rejectWithValue, dispatch }) => {
  try {
    return await setRoles(id, roles);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const refreshResult = await dispatch(refreshThunk());
        if (refreshResult.type === "auth/refresh/fulfilled") {
          return await setRoles(id, roles);
        }
        removeAccessToken();
        removeRefreshToken();
        return rejectWithValue({
          message: "Сессия истекла",
          status: error.response?.status,
        });
      }
      return rejectWithValue(getErrorPayload(error));
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
  },
);

export const blockUserThunk = createAsyncThunk<
  Profile,
  number,
  { rejectValue: ApiError }
>("admin/blockUser", async (id, { rejectWithValue, dispatch }) => {
  try {
    return await blockUser(id);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const refreshResult = await dispatch(refreshThunk());
        if (refreshResult.type === "auth/refresh/fulfilled") {
          return await blockUser(id);
        }
        removeAccessToken();
        removeRefreshToken();
        return rejectWithValue({
          message: "Сессия истекла",
          status: error.response?.status,
        });
      }
      return rejectWithValue(getErrorPayload(error));
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
});

export const unblockUserThunk = createAsyncThunk<
  Profile,
  number,
  { rejectValue: ApiError }
>("admin/unblockUser", async (id, { rejectWithValue, dispatch }) => {
  try {
    return await unblockUser(id);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const refreshResult = await dispatch(refreshThunk());
        if (refreshResult.type === "auth/refresh/fulfilled") {
          return await unblockUser(id);
        }
        removeAccessToken();
        removeRefreshToken();
        return rejectWithValue({
          message: "Сессия истекла",
          status: error.response?.status,
        });
      }
      return rejectWithValue(getErrorPayload(error));
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
});

export const deleteUserThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ApiError }
>("admin/deleteUser", async (id, { rejectWithValue, dispatch }) => {
  try {
    await deleteUser(id);
    return id;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const refreshResult = await dispatch(refreshThunk());
        if (refreshResult.type === "auth/refresh/fulfilled") {
          await deleteUser(id);
          return id;
        }
        removeAccessToken();
        removeRefreshToken();
        return rejectWithValue({
          message: "Сессия истекла",
          status: error.response?.status,
        });
      }
      return rejectWithValue(getErrorPayload(error));
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: initialAdminState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, getUsersThunk, "usersData");
    addAsyncThunkCases(builder, getProfileByIdThunk, "selectedUser");

    builder
      .addCase(updateUserByIdThunk.fulfilled, (state, action) => {
        updateUserInState(state, action.payload);
      })
      .addCase(setUserRolesThunk.fulfilled, (state, action) => {
        updateUserInState(state, action.payload);
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        updateUserInState(state, action.payload);
      })
      .addCase(unblockUserThunk.fulfilled, (state, action) => {
        updateUserInState(state, action.payload);
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        removeUserFromState(state, action.payload);
      });
  },
});

export default adminSlice.reducer;
