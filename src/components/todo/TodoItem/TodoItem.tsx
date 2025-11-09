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
  message,
  Space,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { memo, useState } from "react";
import { deleteTodo, updateTodo } from "../../../api/api";
import type { Todo } from "../../../types/todo.types";

const flexGrow1 = {
  flexGrow: "1",
};

type Props = {
  todo: Todo;
  onUpdate: () => void;
};

export default memo(function TodoItem({ todo, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = useForm();

  const initial = todo.title;

  const handleToggle = async () => {
    await updateTodo(todo.id, { isDone: !todo.isDone }).catch(alert);
    onUpdate();
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id).catch(alert);
    onUpdate();
  };

  const handleConfirm = async () => {
    await updateTodo(todo.id, { title: form.getFieldValue("task") }).catch(
      message.error
    );
    message.success("Задача обновлена");
    onUpdate();
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.setFieldsValue({ task: initial });
    setIsEditing(false);
  };

  return (
    <Card size="small" variant="borderless" style={flexGrow1}>
      <Flex gap="0.5rem" align="center">
        <Checkbox checked={todo.isDone} onChange={handleToggle} />
        <ConfigProvider
          theme={{ components: { Form: { itemMarginBottom: 0 } } }}
        >
          <Form
            size="large"
            form={form}
            id={`todo-form-${todo.id.toString()}`}
            onFinish={handleConfirm}
            style={flexGrow1}
            initialValues={{ task: todo.title }}
          >
            <Form.Item
              name="task"
              hasFeedback={isEditing}
              validateDebounce={500}
              rules={[
                {
                  required: true,
                  message: "Текст задачи не может быть пустым",
                },
                {
                  min: 2,
                  max: 64,
                  message: "Текст задачи должен быть от 2 до 64 символов",
                },
              ]}
            >
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
                variant="solid"
                color="green"
                disabled={!isEditing}
                htmlType="submit"
                icon={<CheckOutlined />}
                form={`todo-form-${todo.id.toString()}`}
              />
              <Button
                type="primary"
                onClick={handleCancel}
                icon={<CloseOutlined />}
                danger
              />
            </>
          ) : (
            <>
              <Button
                type="primary"
                onClick={handleEdit}
                icon={<EditOutlined />}
              />
              <Button
                type="primary"
                onClick={handleDelete}
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
