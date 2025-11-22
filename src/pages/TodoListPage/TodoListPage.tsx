import { Spin } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect } from "react";
import TodoForm from "../../components/todo/TodoForm";
import TodoList from "../../components/todo/TodoList";
import TodoTabs from "../../components/todo/TodoTabs";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getTodosThunk } from "../../store/slices/todosSlice";

export default function TodoListPage() {
  const activeTab = useAppSelector((state) => state.todos.activeTab);
  const isLoading = useAppSelector((state) => state.todos.isLoading);
  const dispatch = useAppDispatch();

  const { message } = useApp();

  const fetchTodos = useCallback(async () => {
    await dispatch(getTodosThunk(activeTab)).catch((error) => {
      message.error(error.message ?? error);
    });
  }, [activeTab, dispatch, message]);

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(() => {
      fetchTodos();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchTodos]);

  return (
    <>
      <TodoForm onAddTodo={fetchTodos} />

      <TodoTabs />

      <Spin spinning={isLoading}>
        <TodoList onUpdateTodo={fetchTodos} />
      </Spin>
    </>
  );
}
