import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.scss";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegistrationPage from "./pages/SignUpPage/SignUpPage";
import TodoListPage from "./pages/TodoListPage/TodoListPage";
import AdminPage from "./pages/AdminPage/AdminPage";

const router = createBrowserRouter([
  {
    Component: () => (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: TodoListPage,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "users",
        Component: AdminPage,
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
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
