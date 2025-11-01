import { useRef, useState } from "react";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import styles from "./TodoForm.module.scss";

type Props = {
  addTodo: (title: string) => void;
};

export default function TodoForm({ addTodo }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    if (value.trim().length < 2) throw new Error("Too short");
    if (value.trim().length > 64) throw new Error("Too long");
    return true;
  };

  return (
    <form
      className={styles["todo-form"]}
      onSubmit={(e) => {
        e.preventDefault();
        try {
          validate();
          addTodo(value);
          setValue("");
        } catch (error) {
          setValue("");
          if (error instanceof Error) setError(error.message);
          else setError("Something went wrong");
        }
      }}
    >
      <Input
        ref={inputRef}
        value={value}
        placeholder="Task to be done..."
        error={error}
        onChange={(e) => {
          setValue(e.target.value);
          setError("");
        }}
        className={styles["todo-form__input"]}
        name="task"
      />
      <Button className={styles["todo-form__button"]} type="submit">
        Add
      </Button>
    </form>
  );
}
