import { useCallback, useEffect, useState } from "react";
import { getTodos } from "../api/api";
import Tabs from "../components/Tabs/Tabs";
import TodoForm from "../components/TodoForm/TodoForm";
import TodoList from "../components/TodoList/TodoList";
import type { Todo, TodoInfo } from "../types/TodoTypes";
import styles from "./TodoListPage.module.scss";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [info, setInfo] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [activeTab, setActiveTab] = useState<keyof TodoInfo>("all");

  const fetchTodos = useCallback(async () => {
    await getTodos(activeTab)
      .then((res) => {
        setTodos(res.data);
        setInfo(res.info ?? { all: 0, inWork: 0, completed: 0 });
      })
      .catch(alert);
  }, [activeTab]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos, activeTab]);

  return (
    <main className={styles["todo-list__container"]}>
      <TodoForm onAdd={fetchTodos} />

      <Tabs
        info={info}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <TodoList todos={todos} onUpdate={fetchTodos} />
    </main>
  );
}
