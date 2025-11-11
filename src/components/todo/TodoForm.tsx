import { Button, Flex, Form, Input } from "antd";
import useApp from "antd/es/app/useApp";
import { memo } from "react";
import { addTodo } from "../../api/api";
import { titleLength } from "../../constants/todo.const";
import type { TodoFormValues, TodoInfo } from "../../types/todo.types";

type TodoFormProps = {
  onAddTodo: (tab: keyof TodoInfo) => Promise<void>;
  activeTab: keyof TodoInfo;
};

export default memo(function TodoForm({ onAddTodo, activeTab }: TodoFormProps) {
  const [form] = Form.useForm();
  const { message } = useApp();

  const handleSubmit = async (values: TodoFormValues) => {
    try {
      await addTodo(values.todo_title);
      onAddTodo(activeTab);
      form.resetFields();
      message.success("Задача добавлена");
    } catch (error) {
      message.error(`Произошла ошибка: ${error}`);
    }
  };

  return (
    <Form
      form={form}
      name="add_task_form"
      onFinish={handleSubmit}
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
              min: titleLength.min,
              max: titleLength.max,
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
          <Button htmlType="submit" type="primary">
            Add
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
});
