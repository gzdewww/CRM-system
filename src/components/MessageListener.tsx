import useApp from "antd/es/app/useApp";
import { useEffect } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectIsAuth } from "../store/slices/auth/authSelectors";
import { selectTodos } from "../store/slices/todo/todoSelectors";

export const MessageListener = () => {
  const { message: messageApi } = useApp();

  const { error: authError } = useAppSelector(selectIsAuth);
  const { error: todosError } = useAppSelector(selectTodos);

  useEffect(() => {
    if (authError?.message) {
      messageApi.error(authError.message);
    }
    if (todosError?.message) {
      messageApi.error(todosError.message);
    }
  }, [authError, todosError, messageApi]);

  return null;
};
