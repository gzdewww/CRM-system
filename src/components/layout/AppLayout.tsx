import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

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

export default function AppLayout() {
  const location = useLocation();

  return (
    <Layout>
      <Sider breakpoint="md" theme="light" style={siderStyle}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={[
            {
              key: "/",
              icon: <UnorderedListOutlined />,
              label: <Link to="/">Список задач</Link>,
            },
            {
              key: "/profile",
              icon: <UserOutlined />,
              label: <Link to="/profile">Профиль</Link>,
            },
          ]}
        />
      </Sider>
      <Content style={contentStyle}>
        <Outlet />
      </Content>
    </Layout>
  );
}
