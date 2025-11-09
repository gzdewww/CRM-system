import { ConfigProvider, App as AntApp } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.scss";
import AppLayout from "./components/layout/AppLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import TodoListPage from "./pages/TodoListPage/TodoListPage";
import { darkTheme, lightTheme } from "./theme";

const router = createBrowserRouter([
  {
    Component: AppLayout,
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
]);

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

function App() {
  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
