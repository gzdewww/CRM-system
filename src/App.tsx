import { ConfigProvider } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.scss";
import AppLayout from "./components/layout/AppLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import TodoListPage from "./pages/TodoListPage/TodoListPage";
import { darkTheme, lightTheme } from "./theme/themeConfig";
import { App as AntdApp } from "antd";

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
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
