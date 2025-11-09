import { List } from "antd";
import { memo } from "react";
import type { Todo } from "../../../types/todo.types";
import TodoItem from "../TodoItem/TodoItem";

type Props = {
  todos: Todo[];
  onUpdate: () => void;
};

export default memo(function TodoList({ todos, onUpdate }: Props) {
  return (
    <List
      split={false}
      dataSource={todos}
      renderItem={(todo) => (
        <List.Item key={todo.id}>
          <TodoItem todo={todo} onUpdate={onUpdate} />
        </List.Item>
      )}
    />
  );
});
