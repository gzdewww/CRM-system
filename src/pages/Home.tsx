import { useCallback, useEffect, useState } from "react";
import { getTodos } from "../api/api";
import Tabs from "../components/Tabs/Tabs";
import TodoForm from "../components/TodoForm/TodoForm";
import TodoList from "../components/TodoList/TodoList";
import type { MetaResponse } from "../types/MetaResponse";
import type { Todo } from "../types/Todo";
import type { TodoInfo } from "../types/TodoInfo";

export default function Home() {
  const [todos, setTodos] = useState<MetaResponse<Todo, TodoInfo>>({
    data: [],
    meta: {
      totalAmount: 0,
    },
  });
  const [activeTab, setActiveTab] = useState("all");

  const fetchTodos = useCallback(async (filter: string) => {
    await getTodos(filter)
      .then((res) => setTodos(res))
      .catch(console.error);
    console.log(`fetch with ${filter} filter`);
  }, []);

  useEffect(() => {
    fetchTodos(activeTab);
  }, [fetchTodos, activeTab]);

  return (
    <>
      <TodoForm fetch={() => fetchTodos(activeTab)} />

      <Tabs
        info={todos.info}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <TodoList todos={todos.data} fetch={() => fetchTodos(activeTab)} />
    </>
  );
}
