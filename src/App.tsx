import { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.scss";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import TodoListPage from "./pages/TodoListPage/TodoListPage";
import { refreshThunk } from "./store/slices/authSlice";
import RestorePasswordPage from "./pages/RestorePasswordPage/RestorePasswordPage";

const router = createBrowserRouter([
  {
    Component: () => (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        Component: TodoListPage,
      },
      {
        path: "/profile",
        Component: ProfilePage,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate to="login" />,
      },
      {
        path: "login",
        Component: AuthPage,
      },
      {
        path: "registration",
        Component: RegistrationPage,
      },
      {
        path: "restore",
        Component: RestorePasswordPage,
      },
    ],
  },
]);

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  useEffect(() => {
    if (!isInitialized || (token?.refreshToken && !token.accessToken)) {
      try {
        dispatch(refreshThunk());
      } catch (error) {
        console.log(error);
      }
    }
  }, [dispatch, token, isInitialized]);

  return <RouterProvider router={router} />;
}

export default App;
