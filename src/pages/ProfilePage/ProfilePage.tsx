import { UserOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Space, Spin, Typography } from "antd";
import { useEffect } from "react";
import UserInfoCard from "../../components/profile/UserInfoCard";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectProfile } from "../../store/slices/users/usersSelectors";
import {
  getProfileThunk,
  signOutThunk,
} from "../../store/slices/users/usersSlice";

const { Title } = Typography;

export default function ProfilePage() {
  const {
    data: profile,
    status: { isLoading },
  } = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  const handleSignOut = async () => {
    await dispatch(signOutThunk());
  };

  return (
    <Spin size="large" spinning={isLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Flex align="center" gap={16}>
            <UserOutlined style={{ fontSize: 48 }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {profile?.username || "Загрузка..."}
              </Title>
              <Typography.Text type="secondary">
                {profile?.email || "—"}
              </Typography.Text>
            </div>
            <Button
              type="primary"
              danger
              onClick={handleSignOut}
              style={{ marginLeft: "auto" }}
            >
              Выйти
            </Button>
          </Flex>
        </Card>

        <UserInfoCard profile={profile} />
      </Space>
    </Spin>
  );
}
