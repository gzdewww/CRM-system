import { memo } from "react";
import type { Todo } from "../../types/TodoTypes";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.scss";

type Props = {
  todos: Todo[];
  onUpdate: () => void;
};

export default memo(function TodoList({ todos, onUpdate, ...props }: Props) {
  return (
    <ul className={styles["todo-list"]} {...props}>
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} />
        ))
      ) : (
        <p>Список пуст</p>
      )}
    </ul>
  );
});
