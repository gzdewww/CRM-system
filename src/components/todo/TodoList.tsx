import { List } from "antd";
import { memo } from "react";
import type { Todo } from "../../types/todo.types";
import TodoItem from "./TodoItem";
import { useAppSelector } from "../../hooks/reduxHooks";

type TodoListProps = {
  onUpdateTodo: () => Promise<void>;
};

export default memo(function TodoList({ onUpdateTodo }: TodoListProps) {
  const todos: Todo[] = useAppSelector((state) => state.todos.todos);

  return (
    <List
      split={false}
      dataSource={todos}
      renderItem={(todo) => (
        <List.Item key={todo.id}>
          <TodoItem todo={todo} onUpdateTodo={onUpdateTodo} />
        </List.Item>
      )}
    />
  );
});
