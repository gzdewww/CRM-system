import { memo, useState } from "react";
import { addTodo } from "../../api/api";
import validateTodo from "../../helpers/validateTodo";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import styles from "./TodoForm.module.scss";

type Props = {
  onAdd: () => void;
};

export default memo(function TodoForm({ onAdd }: Props) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const error = validateTodo(value);
      if (error) {
        throw new Error(error);
      }
      await addTodo(value.trim()).catch(console.error);
      onAdd();
      setValue("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <form className={styles["todo-form"]} onSubmit={handleSubmit}>
      <Input
        value={value}
        placeholder="Task to be done..."
        error={error}
        onChange={handleChange}
        name="task"
      />
      <Button type="submit" onClick={() => {}}>
        Add
      </Button>
    </form>
  );
});
