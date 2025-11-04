import type {
  MetaResponse,
  Todo,
  TodoInfo,
  TodoRequest,
} from "../types/TodoTypes";

const TODO_URL = import.meta.env.VITE_TODO_API_URL;

export async function getTodos(
  filter?: keyof TodoInfo
): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await fetch(
    `${TODO_URL}${filter ? `?filter=${filter}` : ""}`
  );
  return await response.json();
}

export async function addTodo(title: string): Promise<Todo> {
  const todo: TodoRequest = {
    title,
    isDone: false,
  };

  const response = await fetch(TODO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return await response.json();
}

export async function deleteTodo(id: number): Promise<number> {
  const response = await fetch(`${TODO_URL}/${id}`, {
    method: "DELETE",
  });
  return response.status;
}

export async function updateTodo(id: number, todo: TodoRequest): Promise<Todo> {
  const response = await fetch(`${TODO_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return await response.json();
}
