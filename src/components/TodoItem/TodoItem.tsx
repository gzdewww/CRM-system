import {
  BsCheck2Square,
  BsPencilSquare,
  BsTrashFill,
  BsXSquare,
} from "react-icons/bs";

import Alert from "../../UI/Alert/Alert";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";

import clsx from "clsx";
import { useRef, useState } from "react";
import { deleteTodo, updateTodo } from "../../api/api";
import validate from "../../helpers/validate";
import type { Todo } from "../../types/Todo";
import Checkbox from "../../UI/Checkbox/Checkbox";
import styles from "./TodoItem.module.scss";

type Props = {
  todo: Todo;
  fetch: () => void;
};

export default function TodoItem({ todo, fetch }: Props) {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const updateFetch = async (id: number, title?: string, isDone?: boolean) => {
    await updateTodo(id, title, isDone).catch(console.error);
    fetch();
  };

  const deleteFetch = async (id: number) => {
    setIsTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await deleteTodo(id).catch(console.error);
    fetch();
  };

  const inputRef = useRef<HTMLInputElement>(null);

  function confirmEdit() {
    if (title === todo.title) {
      setIsEditing(false);
      setError("");
      inputRef.current?.setSelectionRange(0, 0);
      inputRef.current?.blur();
      return;
    }
    try {
      validate(title);
      setIsEditing(false);
      updateFetch(todo.id, title);
      inputRef.current?.setSelectionRange(0, 0);
      inputRef.current?.blur();
      setError("");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong");
      setTitle(todo.title);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setTitle(todo.title);
    inputRef.current?.blur();
    setError("");
  }

  return (
    <li
      className={clsx(
        styles.todo,
        todo.isDone && styles["todo--done"],
        isTransitioning && styles["todo--sliding"]
      )}
    >
      {error && <Alert message={error} type="error" />}
      <Checkbox
        isDone={todo.isDone}
        onToggle={() => updateFetch(todo.id, undefined, !todo.isDone)}
      />
      <Input
        ref={inputRef}
        aria-label={`Текст задачи: ${todo.title}`}
        className={styles.todo__input}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        disabled={todo.isDone}
        readOnly={!isEditing}
        onKeyDown={(e) => {
          setError("");
          if (e.key === "Enter") confirmEdit();
          if (e.key === "Escape") cancelEdit();
        }}
      />
      {!todo.isDone ? (
        isEditing ? (
          <>
            <Button
              aria-label="Подтвердить"
              className={styles.todo__confirm}
              onClick={confirmEdit}
            >
              <BsCheck2Square />
            </Button>
            <Button
              aria-label="Отменить"
              className={styles.todo__cancel}
              onClick={cancelEdit}
            >
              <BsXSquare />
            </Button>
          </>
        ) : (
          <Button
            aria-label="Редактировать задачу"
            className={styles.todo__edit}
            onClick={() => {
              setIsEditing(true);
              inputRef.current?.focus();
              inputRef.current?.setSelectionRange(
                0,
                inputRef.current.value.length
              );
            }}
          >
            <BsPencilSquare />
          </Button>
        )
      ) : null}

      <Button
        aria-label="Удалить задачу"
        className={styles.todo__delete}
        onClick={() => {
          deleteFetch(todo.id);
        }}
      >
        <BsTrashFill />
      </Button>
    </li>
  );
}
