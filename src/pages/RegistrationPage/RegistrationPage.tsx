import { Button, Flex, Form, Input, Space, Typography } from "antd";
import useApp from "antd/es/app/useApp";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { signUpThunk } from "../../store/slices/authSlice";
import type { UserRegistration } from "../../types/auth.types";
const { Title, Text } = Typography;

export default function RegistrationPage() {
  const error = useAppSelector((state) => state.auth.error);
  const authMessage = useAppSelector((state) => state.auth.message);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { message } = useApp();
  useEffect(() => {
    if (error) {
      message.error(error);
    }
    if (authMessage) {
      message.success(authMessage);
    }
  }, [error, authMessage, message]);

  const handleSubmitRegistration = async (values: UserRegistration) => {
    const response = await dispatch(signUpThunk(values));
    if (response.type === "auth/signUp/fulfilled") {
      navigate("/auth/login", { replace: true });
    }
  };
  return (
    <Flex
      vertical
      align="center"
      justify="space-around"
      style={{ height: "100%" }}
    >
      <Space direction="vertical">
        <img src="/svg/auth_logo.svg" alt="" style={{ alignSelf: "start" }} />
        <Title>Зарегистрируйте аккаунт</Title>
        <Text>Узнайте, что происходит в вашем бизнесе</Text>
      </Space>
      <Form
        name="registration"
        layout="vertical"
        requiredMark="optional"
        style={{ width: "100%" }}
        onFinish={handleSubmitRegistration}
      >
        <Form.Item
          label="Логин"
          name="login"
          rules={[
            { required: true, message: "Введите логин" },
            {
              min: 2,
              max: 60,
              pattern: /^[a-zA-Z0-9_.-]+$/,
              message:
                "Логин должен содержать от 2 до 60 латинских символов или цифр (допускаются точки, дефисы и подчеркивания)",
            },
          ]}
        >
          <Input placeholder="Логин" />
        </Form.Item>
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[
            { required: true, message: "Введите имя пользователя" },
            {
              min: 1,
              max: 60,
            },
          ]}
        >
          <Input placeholder="Имя пользователя" />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            {
              min: 6,
              max: 60,
              message: "Пароль должен содержать от 6 до 60 символов",
            },
          ]}
        >
          <Input type="password" placeholder="Введите пароль" />
        </Form.Item>
        <Form.Item
          label="Повторите пароль"
          name="password_repeat"
          rules={[
            { required: true, message: "Повторите пароль" },
            {
              min: 6,
              max: 60,
              message: "Пароль должен содержать от 6 до 60 символов",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value && value !== getFieldValue("password")) {
                  return Promise.reject("Пароли не совпадают");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input type="password" placeholder="Повторите пароль" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Введите Email" }]}
        >
          <Input placeholder="Email" type="email" />
        </Form.Item>
        <Form.Item
          label="Номер телефона"
          name="phoneNumber"
          rules={[
            {
              pattern: /^\+7\d{10}$/,
              message: "Номер телефона должен быть в формате +7XXXXXXXXXX",
            },
          ]}
        >
          <Input placeholder="Номер телефона" type="tel" />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Регистрация
          </Button>
        </Form.Item>
      </Form>
      <Text>
        Уже зарегистрированы?
        <Link to="/auth/login"> Войти</Link>
      </Text>
    </Flex>
  );
}
