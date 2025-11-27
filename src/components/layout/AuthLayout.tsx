import { App as AntdApp, ConfigProvider, Flex, Spin } from "antd";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectToken } from "../../store/slices/auth/authSelectors";
import { darkTheme, lightTheme } from "../../theme/auth/themeConfig";
import AuthSider from "../auth/AuthSider";
import { MessageListener } from "../MessageListener";

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function AuthLayout() {
  const {
    status: { isLoading },
  } = useAppSelector(selectToken);

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AntdApp>
        <MessageListener />
        <Spin spinning={isLoading}>
          <Flex wrap="wrap" style={{ minHeight: "100dvh", overflow: "hidden" }}>
            <AuthSider />
            <Flex
              justify="center"
              align="center"
              flex={"1 0 468px"}
              style={{ padding: "1rem", width:'max(320px, 80%)' }}
            >
              <Outlet />
            </Flex>
          </Flex>
        </Spin>
      </AntdApp>
    </ConfigProvider>
  );
}
