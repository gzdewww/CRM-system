import { List } from "antd";
import { memo } from "react";
import type { Todo, TodoInfo } from "../../types/todo.types";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  onUpdateTodo: (tab: keyof TodoInfo) => Promise<void>;
  activeTab: keyof TodoInfo;
};

export default memo(function TodoList({
  todos,
  onUpdateTodo,
  activeTab,
}: TodoListProps) {
  return (
    <List
      split={false}
      dataSource={todos}
      renderItem={(todo) => (
        <List.Item key={todo.id}>
          <TodoItem
            todo={todo}
            onUpdateTodo={onUpdateTodo}
            activeTab={activeTab}
          />
        </List.Item>
      )}
    />
  );
});
