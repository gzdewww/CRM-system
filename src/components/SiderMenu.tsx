import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const items = [
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
];

export default function SiderMenu() {
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[location.pathname]}
      items={items}
    />
  );
}
