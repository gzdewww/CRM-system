import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import { getTodos } from "../../api/api";
import TodoForm from "../../components/todo/TodoForm/TodoForm";
import TodoList from "../../components/todo/TodoList/TodoList";
import TodoTabs from "../../components/todo/TodoTabs/TodoTabs";
import type { Todo, TodoInfo } from "../../types/todo.types";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [info, setInfo] = useState<TodoInfo>();
  const [activeTab, setActiveTab] = useState<keyof TodoInfo>("all");

  const { message } = useApp();

  const fetchTodos = useCallback(
    async (tab: keyof TodoInfo) => {
      await getTodos(tab)
        .then((res) => {
          setTodos(res.data);
          setInfo(res.info ?? { all: 0, inWork: 0, completed: 0 });
        })
        .catch(message.error);
    },
    [message.error]
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
      <TodoForm onAdd={() => fetchTodos(activeTab)} />

      <TodoTabs info={info} activeTab={activeTab} setActiveTab={setActiveTab} />

      <TodoList todos={todos} onUpdate={() => fetchTodos(activeTab)} />
    </>
  );
}
