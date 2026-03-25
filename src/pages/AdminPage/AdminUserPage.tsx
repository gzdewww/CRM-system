import {
  ArrowLeftOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AxiosError } from "axios";
import {
  App,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserInfoCard from "../../components/profile/UserInfoCard";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectSelectedUser } from "../../store/slices/admin/adminSelectors";
import {
  getProfileByIdThunk,
  updateUserByIdThunk,
} from "../../store/slices/admin/adminSlice";
import { selectProfile } from "../../store/slices/users/usersSelectors";
import type { UserRequest } from "../../types/admin.types";

const { Title, Text } = Typography;

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Не удалось обновить пользователя";
};

const isFormValidationError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "errorFields" in error;

export default function AdminUserPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<UserRequest>();

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const userId = Number(params.id);

  const {
    data: selectedUser,
    status: { isLoading: isSelectedUserLoading },
  } = useAppSelector(selectSelectedUser);
  const {
    data: currentProfile,
    status: { isLoadedOrError: isCurrentProfileReady, isLoadingOrIdle },
  } = useAppSelector(selectProfile);

  const isAdmin = currentProfile?.roles.includes("ADMIN") ?? false;
  const canOpenUsers =
    isAdmin || (currentProfile?.roles.includes("MODERATOR") ?? false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(userId)) {
      navigate("/users", { replace: true });
      return;
    }
    if (!canOpenUsers) return;
    dispatch(getProfileByIdThunk(userId));
  }, [dispatch, userId, navigate, canOpenUsers]);

  useEffect(() => {
    if (isCurrentProfileReady && !canOpenUsers) {
      navigate("/", { replace: true });
    }
  }, [isCurrentProfileReady, canOpenUsers, navigate]);

  useEffect(() => {
    if (!selectedUser) return;
    form.setFieldsValue({
      username: selectedUser.username,
      email: selectedUser.email,
      phoneNumber: selectedUser.phoneNumber,
    });
  }, [form, selectedUser]);

  const handleCancelEdit = () => {
    if (!selectedUser) return;
    form.setFieldsValue({
      username: selectedUser.username,
      email: selectedUser.email,
      phoneNumber: selectedUser.phoneNumber,
    });
    setIsEditMode(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);
      await dispatch(
        updateUserByIdThunk({
          id: userId,
          request: {
            username: values.username?.trim() || undefined,
            email: values.email?.trim() || undefined,
            phoneNumber: values.phoneNumber?.trim() || undefined,
          },
        }),
      ).unwrap();
      setIsEditMode(false);
      message.success("Данные пользователя обновлены");
    } catch (error) {
      if (isFormValidationError(error)) {
        return;
      }
      message.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingOrIdle) {
    return <Spin size="large" spinning />;
  }

  return (
    <Spin spinning={isSelectedUserLoading || isSaving} size="large">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Flex align="center" gap={16} wrap>
            <UserOutlined style={{ fontSize: 48 }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {selectedUser?.username || "Загрузка..."}
              </Title>
              <Text type="secondary">
                {selectedUser?.email || "—"}
              </Text>
            </div>
            <Space style={{ marginLeft: "auto" }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/users")}
              >
                Вернуться к таблице
              </Button>

              {isAdmin ? (
                isEditMode ? (
                  <>
                    <Button onClick={handleCancelEdit}>Отмена</Button>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      loading={isSaving}
                    >
                      Сохранить
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditMode(true)}
                  >
                    Редактировать
                  </Button>
                )
              ) : null}
            </Space>
          </Flex>
        </Card>

        {isAdmin && isEditMode ? (
          <Card title="Редактирование пользователя">
            <Form<UserRequest> form={form} layout="vertical">
              <Form.Item
                label="Имя пользователя"
                name="username"
                rules={[
                  { required: true, message: "Введите имя пользователя" },
                  { min: 3, message: "Минимум 3 символа" },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Введите email" },
                  { type: "email", message: "Некорректный email" },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item label="Телефон" name="phoneNumber">
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Form>
          </Card>
        ) : null}

        <UserInfoCard profile={selectedUser} />
      </Space>
    </Spin>
  );
}
