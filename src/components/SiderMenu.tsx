import {
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectProfile } from "../store/slices/users/usersSelectors";

export default function SiderMenu() {
  const location = useLocation();
  const { data: profile } = useAppSelector(selectProfile);

  const canSeeUsersMenu = profile?.roles.some(
    (role) => role === "ADMIN" || role === "MODERATOR",
  );

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
    ...(canSeeUsersMenu
      ? [
          {
            key: "/users",
            icon: <TeamOutlined />,
            label: <Link to="/users">Пользователи</Link>,
          },
        ]
      : []),
  ];

  const selectedKey = location.pathname.startsWith("/users")
    ? "/users"
    : location.pathname;

  return (
    <Menu mode="inline" selectedKeys={[selectedKey || "/"]} items={items} />
  );
}
