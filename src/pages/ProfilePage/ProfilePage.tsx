// pages/ProfilePage/ProfilePage.tsx
import {
  CalendarOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Descriptions, Space, Spin, Tag, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { refreshThunk } from "../../store/slices/authSlice";
import { getProfileThunk, signOutThunk } from "../../store/slices/userSlice";

const { Title } = Typography;

export default function ProfilePage() {
  const profile = useAppSelector((state) => state.user.profile);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      dispatch(getProfileThunk())
    } catch {
      dispatch(refreshThunk());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(signOutThunk());
    navigate("/auth/login", { replace: true });
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Spin size="large" spinning={isLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space align="center" size="middle">
            <UserOutlined style={{ fontSize: 48 }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {profile?.username || "Загрузка..."}
              </Title>
              <Typography.Text type="secondary">
                {profile?.email || "—"}
              </Typography.Text>
            </div>
          </Space>
        </Card>

        <Card
          title="Информация о профиле"
          extra={
            <Button type="primary" danger onClick={handleLogout}>
              Выйти
            </Button>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined />
                  ID
                </Space>
              }
            >
              {profile?.id || "—"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined />
                  Логин
                </Space>
              }
            >
              {profile?.username || "—"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined />
                  Имя
                </Space>
              }
            >
              {profile?.username || "—"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined />
                  Email
                </Space>
              }
            >
              {profile?.email || "—"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <PhoneOutlined />
                  Телефон
                </Space>
              }
            >
              {profile?.phoneNumber || "—"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <CalendarOutlined />
                  Дата регистрации
                </Space>
              }
            >
              {formatDate(profile?.date)}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <SafetyOutlined />
                  Роли
                </Space>
              }
            >
              <Space wrap>
                {profile?.roles && profile.roles.length > 0
                  ? profile.roles.map((role) => (
                      <Tag key={role} color="blue">
                        {role}
                      </Tag>
                    ))
                  : "—"}
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Статус аккаунта">
              {profile?.isBlocked ? (
                <Tag color="red">Заблокирован</Tag>
              ) : (
                <Tag color="green">Активен</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </Spin>
  );
}
