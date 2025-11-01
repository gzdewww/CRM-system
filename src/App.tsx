import { useCallback, useEffect, useState } from "react";
import { addTodo, deleteTodo, getTodos, updateTodo } from "./api/api";
import "./App.scss";
import Tabs from "./components/Tabs/Tabs";
import TodoForm from "./components/TodoForm/TodoForm";
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

  const fetchTodos = useCallback(async () => {
    getTodos().then((res) => setTodos(res));
    console.log("fetch");
  }, []);

  const updateFetch = useCallback(
    async (id: number, title?: string, isDone?: boolean) => {
      await updateTodo(id, title, isDone);
      fetchTodos();
    },
    [fetchTodos]
  );

  const deleteFetch = useCallback(
    async (id: number) => {
      await deleteTodo(id);
      fetchTodos();
    },
    [fetchTodos]
  );

  const addFetch = useCallback(
    async (title: string) => {
      await addTodo(title);
      fetchTodos();
    },
    [fetchTodos]
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <>
      <TodoForm addTodo={addFetch} />

      <Tabs meta={todos} onDelete={deleteFetch} onUpdate={updateFetch} />
    </>
  );
}

export default App;
