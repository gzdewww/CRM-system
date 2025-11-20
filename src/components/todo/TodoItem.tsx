import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  RestOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Flex,
  Form,
  Input,
  Space,
} from "antd";
import useApp from "antd/es/app/useApp";
import { useForm } from "antd/es/form/Form";
import { isAxiosError } from "axios";
import { memo, useState } from "react";
import { deleteTodo, updateTodo } from "../../api/api";
import { TODO_TITLE_LENGTH } from "../../constants/todo.const";
import type { Todo, TodoFormValues, TodoInfo } from "../../types/todo.types";

type TodoItemProps = {
  todo: Todo;
  onUpdateTodo: (tab: keyof TodoInfo) => Promise<void>;
  activeTab: keyof TodoInfo;
};

export default memo(function TodoItem({
  todo,
  onUpdateTodo,
  activeTab,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = useForm();

  const { message } = useApp();

  const initial = todo.title;

  const handleToggleTodo = async () => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      onUpdateTodo(activeTab);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          message.error(`Error data: ${error.response.data}`);
        } else if (error.request) {
          message.error("Request error:", error.request);
        }
      }
      if (error instanceof Error) {
        message.error(`Error message: ${error.message}`);
      }
    }
  };

  const handleEditTodo = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleDeleteTodo = async () => {
    try {
      await deleteTodo(todo.id);
      message.success("Задача удалена");
      onUpdateTodo(activeTab);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          message.error(`Error data: ${error.response.data}`);
        } else if (error.request) {
          message.error("Request error:", error.request);
        }
      }
      if (error instanceof Error) {
        message.error(`Error message: ${error.message}`);
      }
    }
  };

  const handleConfirmEditing = async (values: TodoFormValues) => {
    try {
      await updateTodo(todo.id, { title: values.todo_title });
      message.success("Задача обновлена");
      onUpdateTodo(activeTab);
      setIsEditing(false);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          message.error(`Error data: ${error.response.data}`);
        } else if (error.request) {
          message.error("Request error:", error.request);
        }
      }
      if (error instanceof Error) {
        message.error(`Error message: ${error.message}`);
      }
    }
  };

  const handleCancelEditing = () => {
    form.setFieldsValue({ todo_title: initial });
    setIsEditing(false);
  };

  return (
    <Card size="small" variant="borderless" style={{ flexGrow: 1 }}>
      <Flex gap="0.5rem" align="center">
        <Checkbox checked={todo.isDone} onChange={handleToggleTodo} />
        <ConfigProvider
          theme={{ components: { Form: { itemMarginBottom: 0 } } }}
        >
          <Form
            size="large"
            form={form}
            id={`todo-form-${todo.id.toString()}`}
            onFinish={handleConfirmEditing}
            style={{ flexGrow: 1 }}
            initialValues={{ todo_title: todo.title }}
          >
            <Form.Item
              name="todo_title"
              hasFeedback={isEditing}
              validateDebounce={500}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Текст задачи не может быть пустым",
                },
                {
                  min: TODO_TITLE_LENGTH.min,
                  max: TODO_TITLE_LENGTH.max,
                  transform: (value) => value.trim(),
                  message: "Текст задачи должен быть от 2 до 64 символов",
                },
              ]}
            >
              {/* Вызывает Warning: [antd: Input] When Input is focused,
              dynamic add or remove prefix / suffix will make it lose focus
              caused by dom structure change.
              Не думаю, что надо это править, так как изменение isEditing
              должно вызывать потерю фокуса */}
              <Input
                showCount={isEditing}
                size="large"
                readOnly={!isEditing}
                variant={isEditing ? "underlined" : "borderless"}
              />
            </Form.Item>
          </Form>
        </ConfigProvider>
        <Space.Compact size="large">
          {isEditing ? (
            <>
              <Button
                title="Подтвердить"
                variant="solid"
                color="green"
                disabled={!isEditing}
                htmlType="submit"
                icon={<CheckOutlined />}
                form={`todo-form-${todo.id.toString()}`}
              />
              <Button
                title="Отмена"
                type="primary"
                onClick={handleCancelEditing}
                icon={<CloseOutlined />}
                danger
              />
            </>
          ) : (
            <>
              <Button
                title="Редактировать"
                type="primary"
                onClick={handleEditTodo}
                icon={<EditOutlined />}
              />
              <Button
                title="Удалить"
                type="primary"
                onClick={handleDeleteTodo}
                icon={<RestOutlined />}
                danger
              />
            </>
          )}
        </Space.Compact>
      </Flex>
    </Card>
  );
});
