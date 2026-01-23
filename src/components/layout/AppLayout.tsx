import { App as AntdApp, ConfigProvider, Layout } from "antd";
import { Outlet } from "react-router-dom";
import { darkTheme, lightTheme } from "../../theme/todo/themeConfig";
import { MessageListener } from "../MessageListener";
import SiderMenu from "../SiderMenu";

const { Sider, Content } = Layout;

// без стилизации Layout занимает не всю высоту, фиксится только стилями
const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100dvh",
  position: "sticky",
  top: 0,
};

const contentStyle: React.CSSProperties = {
  padding: "1em",
  minHeight: "100dvh",
  overflow: "auto",
  maxWidth: "1280px",
  margin: "0 auto",
};

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function AppLayout() {
  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AntdApp>
        <MessageListener />
        <Layout>
          <Sider breakpoint="md" theme="light" style={siderStyle}>
            <SiderMenu />
          </Sider>
          <Content style={contentStyle}>
            <Outlet />
          </Content>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  );
}
