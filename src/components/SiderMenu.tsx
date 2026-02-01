import { TeamOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
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
  {
    key: "/users",
    icon: <TeamOutlined />,
    label: <Link to="/users">Пользователи</Link>,
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
