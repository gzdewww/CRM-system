import useApp from "antd/es/app/useApp";
import { useEffect } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import {
  selectSelectedUser,
  selectUsersData,
} from "../store/slices/admin/adminSelectors";
import { selectIsAuth } from "../store/slices/auth/authSelectors";
import { selectTodos } from "../store/slices/todo/todoSelectors";

export const MessageListener = () => {
  const { message: messageApi } = useApp();

  const { error: authError } = useAppSelector(selectIsAuth);
  const { error: todosError } = useAppSelector(selectTodos);
  const { error: usersError } = useAppSelector(selectUsersData);
  const { error: selectedUserError } = useAppSelector(selectSelectedUser);

  useEffect(() => {
    if (authError?.message) {
      messageApi.error(authError.message);
    }
    if (todosError?.message) {
      messageApi.error(todosError.message);
    }
    if (usersError?.message) {
      messageApi.error(usersError.message);
    }
    if (selectedUserError?.message) {
      messageApi.error(selectedUserError.message);
    }
  }, [authError, todosError, usersError, selectedUserError, messageApi]);

  return null;
};
