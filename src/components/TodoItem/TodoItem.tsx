import {
  BsCheck2Square,
  BsPencilSquare,
  BsTrashFill,
  BsXSquare,
} from "react-icons/bs";

import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";

import { memo, useEffect, useRef, useState } from "react";
import { deleteTodo, updateTodo } from "../../api/api";
import validateTodo from "../../helpers/validateTodo";
import type { Todo } from "../../types/TodoTypes";
import Checkbox from "../../UI/Checkbox/Checkbox";
import styles from "./TodoItem.module.scss";

type Props = {
  todo: Todo;
  onUpdate: () => void;
};

export default memo(function TodoItem({ todo, onUpdate }: Props) {
  const [title, setTitle] = useState<string>(todo.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const todoElement = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const element = todoElement.current;
    if (!element) {
      return;
    }

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (isRemoving && todoElement.current === event.target) {
        onUpdate();
      }
    };

    element.addEventListener("animationend", handleAnimationEnd);
    return () => {
      element.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [isRemoving, onUpdate]);

  const handleToggle = async () => {
    await updateTodo(todo.id, { isDone: !todo.isDone }).catch(alert);
    onUpdate();
  };

  const handleDelete = async () => {
    setIsRemoving(true);
    await deleteTodo(todo.id).catch(alert);
  };

  const handleConfirm = async () => {
    try {
      const error = validateTodo(title);
      if (error) {
        throw new Error(error);
      }
      await updateTodo(todo.id, { title }).catch(alert);
      onUpdate();
      setIsEditing(false);
      setError("");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(todo.title);
    setError("");
  };

  return (
    <li
      ref={todoElement}
      className={[
        styles.todo,
        todo.isDone ? styles["todo--done"] : "",
        isRemoving ? styles["todo--transition"] : "",
      ].join(" ")}
    >
      <Checkbox isDone={todo.isDone} onToggle={handleToggle} />
      <form
        id={todo.id.toString()}
        onSubmit={(e) => e.preventDefault()}
        className={styles.todo__form}
      >
        <Input
          aria-label={`Текст задачи: ${todo.title}`}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          readOnly={!isEditing}
          error={error}
        />
      </form>
      {isEditing ? (
        <>
          <Button
            aria-label="Подтвердить"
            type="submit"
            form={todo.id.toString()}
            onClick={handleConfirm}
            variant="success"
          >
            <BsCheck2Square className={styles.todo__confirm} />
          </Button>
          <Button aria-label="Отменить" onClick={handleCancel}>
            <BsXSquare className={styles.todo__cancel} />
          </Button>
        </>
      ) : (
        <Button
          aria-label="Редактировать задачу"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          <BsPencilSquare className={styles.todo__edit} />
        </Button>
      )}

      <Button
        aria-label="Удалить задачу"
        onClick={handleDelete}
        variant="danger"
      >
        <BsTrashFill className={styles.todo__delete} />
      </Button>
    </li>
  );
});
