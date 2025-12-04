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
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { setRememberMe, signInThunk } from "../../store/slices/auth/authSlice";
import type { AuthData } from "../../types/auth.types";
import {
  LOGIN_VALIDATION,
  PASSWORD_VALIDATION,
} from "../../constants/auth.const";

const { Title, Text } = Typography;

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmitLogin = async (values: AuthData) => {
    const response = await dispatch(signInThunk(values));
    if (response.type === "auth/signIn/fulfilled") {
      navigate("/");
    }
  };

  const handleToggleRememberMe = (event: CheckboxChangeEvent) => {
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
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox onChange={handleToggleRememberMe}>Запомнить меня</Checkbox>
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
