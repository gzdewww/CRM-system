import { List } from "antd";
import { memo } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import {
  selectTodos
} from "../../store/slices/todo/todoSelectors";
import TodoItem from "./TodoItem";

type TodoListProps = {
  onUpdateTodo: () => Promise<void>;
};

export default memo(function TodoList({ onUpdateTodo }: TodoListProps) {
  const { data: todosData } = useAppSelector(selectTodos);

  return (
    <List
      split={false}
      dataSource={todosData?.data}
      renderItem={(todo) => (
        <List.Item key={todo.id}>
          <TodoItem todo={todo} onUpdateTodo={onUpdateTodo} />
        </List.Item>
      )}
    />
  );
});
