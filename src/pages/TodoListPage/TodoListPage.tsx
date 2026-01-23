import { Spin } from "antd";
import { useCallback, useEffect } from "react";
import TodoForm from "../../components/todo/TodoForm";
import TodoList from "../../components/todo/TodoList";
import TodoTabs from "../../components/todo/TodoTabs";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getTodosThunk } from "../../store/slices/todo/todoSlice";
import {
  selectActiveTab,
  selectTodos,
} from "../../store/slices/todo/todoSelectors";

export default function TodoListPage() {
  const { status: todosStatus } = useAppSelector(selectTodos);
  const { isLoading } = todosStatus;
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();

  const fetchTodos = useCallback(async () => {
    await dispatch(getTodosThunk(activeTab));
  }, [activeTab, dispatch]);

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
