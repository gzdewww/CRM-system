import useApp from "antd/es/app/useApp";
import { useEffect } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectToken } from "../store/slices/auth/authSelectors";
import { selectTodos } from "../store/slices/todo/todoSelectors";

export const MessageListener = () => {
  const { message: messageApi } = useApp();

  const { error: tokenError } = useAppSelector(selectToken);
  const { error: todosError } = useAppSelector(selectTodos);

  useEffect(() => {
    if (tokenError || todosError) {
      if (tokenError?.message) {
        messageApi.error(tokenError.message);
      }
      if (todosError?.message) {
        messageApi.error(todosError.message);
      }
    }
  }, [tokenError, todosError, messageApi]);

  return null;
};