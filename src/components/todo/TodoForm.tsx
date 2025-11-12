import { Button, Flex, Form, Input } from "antd";
import useApp from "antd/es/app/useApp";
import { isAxiosError } from "axios";
import { memo } from "react";
import { addTodo } from "../../api/api";
import { TODO_TITLE_LENGTH } from "../../constants/todo.const";
import type { TodoFormValues, TodoInfo } from "../../types/todo.types";

type TodoFormProps = {
  onAddTodo: (tab: keyof TodoInfo) => Promise<void>;
  activeTab: keyof TodoInfo;
};

export default memo(function TodoForm({ onAddTodo, activeTab }: TodoFormProps) {
  const [form] = Form.useForm();
  const { message } = useApp();

  const handleSubmitTodo = async (values: TodoFormValues) => {
    try {
      await addTodo(values.todo_title);
      onAddTodo(activeTab);
      form.resetFields();
      message.success("Задача добавлена");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          message.error(`Error data: ${error.response.data}`);
          message.error(`Error status: ${error.response.status}`);
          message.error(`Error headers: ${error.response.headers}`);
        } else if (error.request) {
          message.error("Request error:", error.request);
        }
      }
      if (error instanceof Error) {
        message.error(`Error message: ${error.message}`);
      }
    }
  };

  return (
    <Form
      form={form}
      name="add_task_form"
      onFinish={handleSubmitTodo}
      size="large"
      layout="horizontal"
    >
      <Flex gap="1rem">
        <Form.Item
          hasFeedback
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
          name="todo_title"
          style={{ flexGrow: 1 }}
        >
          <Input
            showCount
            type="text"
            placeholder="Задача к выполнению..."
            name="todo"
            variant="underlined"
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary" title="Добавить задачу">
            Добавить
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
});
