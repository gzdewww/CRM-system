import { Button } from "antd";
import { Link } from "react-router-dom";

export default function RestorePasswordPage() {
  return (
    <>
      <div>Тут можно будет восстановить пароль</div>
      <Button type="primary">
        <Link to="/auth/login">Назад</Link>
      </Button>
    </>
  );
}
