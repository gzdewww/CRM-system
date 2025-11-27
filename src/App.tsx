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
import RegistrationPage from "./pages/SignUpPage/SignUpPage";
import RestorePasswordPage from "./pages/RestorePasswordPage/RestorePasswordPage";
import TodoListPage from "./pages/TodoListPage/TodoListPage";
import { selectToken } from "./store/slices/auth/authSelectors";
import { refreshThunk } from "./store/slices/auth/authSlice";

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
  const {
    data: token,
    status: { isLoaded },
  } = useAppSelector(selectToken);

  useEffect(() => {
    if (!isLoaded || (token?.refreshToken && !token.accessToken)) {
      dispatch(refreshThunk());
    }
  }, [dispatch, token, isLoaded]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
