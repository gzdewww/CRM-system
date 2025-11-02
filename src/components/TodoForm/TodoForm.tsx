import { useRef, useState } from "react";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import styles from "./TodoForm.module.scss";
import validate from "../../helpers/validate";
import { addTodo } from "../../api/api";

type Props = {
  fetch: () => void;
};

export default function TodoForm({ fetch }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const addFetch = async (title: string) => {
    await addTodo(title).catch(console.error);
    fetch();
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className={styles["todo-form"]}
      onSubmit={async(e) => {
        e.preventDefault();
        try {
          validate(value);
          await addFetch(value);
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
