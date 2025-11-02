import type { Todo } from "../../types/Todo";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.scss";

type Props = {
  todos: Todo[];
  fetch: () => void;
};

export default function TodoList({ todos, fetch, ...props }: Props) {
  return (
    <ul className={styles["todo-list"]} {...props}>
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            fetch={fetch}
          />
        ))
      ) : (
        <p>Список пуст</p>
      )}
    </ul>
  );
}
