import useApp from "antd/es/app/useApp";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { getTodos } from "../../api/api";
import TodoForm from "../../components/todo/TodoForm";
import TodoList from "../../components/todo/TodoList";
import TodoTabs from "../../components/todo/TodoTabs";
import type { Todo, TodoInfo } from "../../types/todo.types";
import { TODO_TAB_DEFAULT_STATE } from "../../constants/todo.const";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [info, setInfo] = useState<TodoInfo>();
  const [activeTab, setActiveTab] = useState<keyof TodoInfo>("all");

  const { message } = useApp();

  const fetchTodos = useCallback(
    async (tab: keyof TodoInfo) => {
      try {
        await getTodos(tab).then((res) => {
          setTodos(res.data);
          setInfo(res.info ?? TODO_TAB_DEFAULT_STATE);
        });
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) {
            message.error(`Error data: ${error.response.data}`);
          } else if (error.request) {
            message.error("Request error:", error.request);
          }
        }
        if (error instanceof Error) {
          message.error(`Error message: ${error.message}`);
        }
      }
    },
    [message]
  );

  useEffect(() => {
    fetchTodos(activeTab);
    const interval = setInterval(() => {
      fetchTodos(activeTab);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchTodos, activeTab]);

  return (
    <>
      <TodoForm onAddTodo={fetchTodos} activeTab={activeTab} />

      <TodoTabs info={info} activeTab={activeTab} setActiveTab={setActiveTab} />

      <TodoList todos={todos} onUpdateTodo={fetchTodos} activeTab={activeTab} />
    </>
  );
}
