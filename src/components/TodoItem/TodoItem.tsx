import {
  BsCheck2Square,
  BsPencilSquare,
  BsTrashFill,
  BsXSquare,
} from "react-icons/bs";

import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";

import { useRef, useState } from "react";
import type { Todo } from "../../types/Todo";
import Checkbox from "../../UI/Checkbox/Checkbox";
import styles from "./TodoItem.module.scss";

type Props = {
  todo: Todo;
  updateTodo: (title?: string, isDone?: boolean) => void;
  deleteTodo: () => void;
};

export default function TodoItem({ todo, updateTodo, deleteTodo }: Props) {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const confirmEdit = () => {
    setIsEditing(false);
    updateTodo(title, todo.isDone);
    inputRef.current?.blur();
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTitle(todo.title);
    inputRef.current?.blur();
  };

  return (
    <li className={`${styles.todo} ${todo.isDone ? styles["todo--done"] : ""}`}>
      <Checkbox
        isDone={todo.isDone}
        onToggle={() => updateTodo(todo.title, !todo.isDone)}
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
          if (e.key === "Enter") confirmEdit();
          if (e.key === "Escape") cancelEdit();
        }}
      />
      {isEditing ? (
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
            inputRef.current?.select();
          }}
        >
          <BsPencilSquare />
        </Button>
      )}

      <Button
        aria-label="Удалить задачу"
        className={styles.todo__delete}
        onClick={deleteTodo}
      >
        <BsTrashFill />
      </Button>
    </li>
  );
}
