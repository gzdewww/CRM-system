import { Button, Flex, Form, Input, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { signUpThunk } from "../../store/slices/auth/authSlice";
import type { UserRegistration } from "../../types/auth.types";
import {
  LOGIN_VALIDATION,
  PASSWORD_VALIDATION,
  TEL_VALIDATION,
  USERNAME_VALIDATION,
} from "../../constants/auth.const";
const { Title, Text } = Typography;

export default function RegistrationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmitRegistration = async (values: UserRegistration) => {
    const response = await dispatch(signUpThunk(values));
    if (response.meta.requestStatus === "fulfilled") {
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
              min: LOGIN_VALIDATION.min,
              max: LOGIN_VALIDATION.max,
              message: "Логин должен содержать от 2 до 60 символов ",
            },
            {
              pattern: LOGIN_VALIDATION.pattern,
              message:
                "Логин должен содержать только латинские буквы, цифры, точку, дефис и подчеркивание",
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
              min: USERNAME_VALIDATION.min,
              max: USERNAME_VALIDATION.max,
              message: "Имя пользователя должно содержать от 1 до 60 символов",
            },
            {
              pattern: USERNAME_VALIDATION.pattern,
              message:
                "Имя пользователя должно содержать только русские и латинские буквы, цифры, точку, дефис и подчеркивание",
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
              min: PASSWORD_VALIDATION.min,
              max: PASSWORD_VALIDATION.max,
              message: "Пароль должен содержать от 6 до 60 символов",
            },
          ]}
        >
          <Input type="password" placeholder="Введите пароль" />
        </Form.Item>
        <Form.Item
          label="Повторите пароль"
          name="passwordRepeat"
          rules={[
            { required: true, message: "Повторите пароль" },
            {
              min: PASSWORD_VALIDATION.min,
              max: PASSWORD_VALIDATION.max,
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
              pattern: TEL_VALIDATION.pattern,
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
