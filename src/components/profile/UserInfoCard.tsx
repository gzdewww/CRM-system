import {
  CalendarOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Space, Tag } from "antd";
import type { Profile } from "../../types/auth.types";
import { formatDate } from "../../helpers/formatDate";

interface UserInfoCardProps {
  profile: Profile | null;
}

export default function UserInfoCard({ profile }: UserInfoCardProps) {
  // const { data: profile } = useAppSelector(selectProfile);

  return (
    <Card title="Информация о профиле">
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
  );
}
