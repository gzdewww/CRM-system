import type {
  MetaResponse as MetaResponseAdmin,
  Profile,
} from "../types/auth.types";
import type {
  MetaResponse as MetaResponseTodo,
  Todo,
  TodoInfo,
} from "../types/todo.types";
import type { AdminState } from "./slices/admin/adminSlice";
import type { AuthState } from "./slices/auth/authSlice";
import type { TodoState } from "./slices/todo/todoSlice";
import type { UserState } from "./slices/users/usersSlice";
import { createAsyncParticle } from "./utils/asyncUtils";

export const initialTodosState: TodoState = {
  todos: createAsyncParticle<MetaResponseTodo<Todo, TodoInfo>>(null),
  activeTab: "all",
};

export const initialAuthState: AuthState = {
  isAuth: createAsyncParticle<boolean>(false),
  rememberMe: false,
};

export const initialUserState: UserState = {
  profile: createAsyncParticle<Profile>(null),
};

export const initialAdminState: AdminState = {
  usersData: createAsyncParticle<MetaResponseAdmin<Profile>>(null),
  selectedUser: createAsyncParticle<Profile>(null),
};
