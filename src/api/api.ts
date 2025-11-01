import type { MetaResponse } from "../types/MetaResponse";
import type { Todo } from "../types/Todo";
import type { TodoInfo } from "../types/TodoInfo";
import type { TodoRequest } from "../types/TodoRequest";

export default function api() {
  return {
    getTodos,
    addTodo,
    deleteTodo,
    updateTodo,
  };
}
export async function getTodos(): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await fetch("https://easydev.club/api/v1/todos");
  return await response.json();
}

export async function addTodo(title: string): Promise<Todo> {
  const todo: TodoRequest = {
    title,
    isDone: false,
  };

  const response = await fetch("https://easydev.club/api/v1/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return await response.json();
}

export async function deleteTodo(id: number): Promise<number> {
  const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
    method: "DELETE",
  });
  return response.status;
}

export async function updateTodo(
  id: number,
  title?: string,
  isDone?: boolean
): Promise<Todo> {
  const todo: TodoRequest = {
    title,
    isDone,
  };

  const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return await response.json();
}
