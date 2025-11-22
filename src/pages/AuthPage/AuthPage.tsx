import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Space,
  Typography,
  type CheckboxChangeEvent,
} from "antd";
import useApp from "antd/es/app/useApp";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setRememberMe, signInThunk } from "../../store/slices/authSlice";
import type { AuthData } from "../../types/auth.types";

const { Title, Text } = Typography;

export default function AuthPage() {
  const error = useAppSelector((state) => state.auth.error);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { message } = useApp();

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error, message]);

  const handleSubmitLogin = async (values: AuthData) => {
    const response = await dispatch(signInThunk(values));
    if (response.type === "auth/signIn/fulfilled") {
      navigate("/");
    }
  };

  const handleToggleRememerMe = (event: CheckboxChangeEvent) => {
    dispatch(setRememberMe(event.target.checked));
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
        <Title>Войдите в свой аккаунт</Title>
        <Text>Узнайте, что происходит в вашем бизнесе</Text>
      </Space>
      <Form
        name="auth"
        layout="vertical"
        onFinish={handleSubmitLogin}
        requiredMark={false}
        style={{ width: "100%" }}
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
        <Form.Item name="remember" valuePropName="checked">
          <Flex justify="space-between">
            <Checkbox onChange={handleToggleRememerMe}>Запомнить меня</Checkbox>
            <Link to="/auth/restore">Забыли пароль?</Link>
          </Flex>
        </Form.Item>
        <Form.Item style={{ maxHeight: 1000 }}>
          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <Text>
        Ещё не зарегистрированы?
        <Link to="/auth/registration"> Создать аккаунт</Link>
      </Text>
    </Flex>
  );
}
