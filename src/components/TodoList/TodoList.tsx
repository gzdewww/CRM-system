import type { Todo } from "../../types/Todo";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.scss";

type Props = {
  todos: Todo[];
  onUpdate: (id: number, title?: string, isDone?: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  style?: React.CSSProperties;
};

export default function TodoList({
  todos,
  onUpdate,
  onDelete,
  style,
  ...props
}: Props) {
  return (
    <ul className={styles["todo-list"]} style={style} {...props}>
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateTodo={(title, isDone) => onUpdate(todo.id, title, isDone)}
            deleteTodo={() => onDelete(todo.id)}
          />
        ))
      ) : (
        <p>Список пуст</p>
      )}
    </ul>
  );
}
