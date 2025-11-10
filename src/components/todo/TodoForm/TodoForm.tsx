// import Button from "../../UI/Button/Button";
// import Input from "../../UI/Input/Input";
import { Button, Flex, Form, Input } from "antd";
import useApp from "antd/es/app/useApp";
import { memo } from "react";
import { addTodo } from "../../../api/api";

type Props = {
  onAdd: () => void;
};

export default memo(function TodoForm({ onAdd }: Props) {
  const [form] = Form.useForm();

  const { message } = useApp();

  const handleSubmit = async () => {
    await addTodo(form.getFieldValue("task_input")).catch(message.error);
    onAdd();
    form.resetFields();
    message.success("Задача добавлена");
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
              min: 2,
              max: 64,
              transform: (value) => value.trim(),
              message: "Текст задачи должен быть от 2 до 64 символов",
            },
          ]}
          name="task_input"
          style={{ flexGrow: 1 }}
        >
          <Input
            showCount
            type="text"
            placeholder="Task to be done..."
            name="task"
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
