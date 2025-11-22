import { App as AntdApp, ConfigProvider, Flex, Spin } from "antd";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { darkTheme, lightTheme } from "../../theme/auth/themeConfig";
import AuthSider from "../auth/AuthSider";

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function AuthLayout() {
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AntdApp>
        <Spin spinning={isLoading}>
          <Flex wrap="wrap" style={{ minHeight: "100dvh", overflow: "hidden" }}>
            <AuthSider />
            <Flex
              justify="center"
              align="center"
              flex={"1 0 468px"}
              style={{ padding: "1rem" }}
            >
              <Outlet />
            </Flex>
          </Flex>
        </Spin>
      </AntdApp>
    </ConfigProvider>
  );
}
