import { useCallback, useEffect, useState } from "react";
import { addTodo, deleteTodo, getTodos, updateTodo } from "./api/api";
import "./App.scss";
import Tabs from "./components/Tabs/Tabs";
import TodoForm from "./components/TodoForm/TodoForm";
import TodoList from "./components/TodoList/TodoList";
import type { MetaResponse } from "./types/MetaResponse";
import type { Todo } from "./types/Todo";
import type { TodoInfo } from "./types/TodoInfo";

function App() {
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

  const updateFetch = useCallback(
    async (id: number, title?: string, isDone?: boolean) => {
      await updateTodo(id, title, isDone);
      fetchTodos(activeTab);
    },
    [fetchTodos, activeTab]
  );

  const deleteFetch = useCallback(
    async (id: number) => {
      await deleteTodo(id);
      fetchTodos(activeTab);
    },
    [fetchTodos, activeTab]
  );

  const addFetch = useCallback(
    async (title: string) => {
      await addTodo(title);
      fetchTodos(activeTab);
    },
    [fetchTodos, activeTab]
  );

  useEffect(() => {
    fetchTodos(activeTab);
  }, [fetchTodos, activeTab]);

  return (
    <>
      <TodoForm addTodo={addFetch} />

      <Tabs
        info={todos.info ?? { all: 0, inWork: 0, completed: 0 }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <TodoList
        todos={todos.data}
        onUpdate={updateFetch}
        onDelete={deleteFetch}
      />
    </>
  );
}

export default App;
