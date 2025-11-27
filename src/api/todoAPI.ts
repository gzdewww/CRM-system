import axios from "axios";
import type {
  MetaResponse,
  Todo,
  TodoInfo,
  TodoRequest,
} from "../types/todo.types";

const TODO_URL = import.meta.env.VITE_TODO_API_URL;

const todoInstance = axios.create({
  baseURL: TODO_URL,
  timeout: 10000,
});

export async function getTodos(
  filter?: keyof TodoInfo
): Promise<MetaResponse<Todo, TodoInfo>> {
  return (await todoInstance.get("", { params: { filter } })).data;
}

export async function addTodo(title: string): Promise<Todo> {
  const todo: TodoRequest = {
    title,
    isDone: false,
  };

  return (await todoInstance.post("", todo)).data;
}

export async function deleteTodo(id: number): Promise<void> {
  await todoInstance.delete(String(id));
}

export async function updateTodo(id: number, todo: TodoRequest): Promise<Todo> {
  return (await todoInstance.put(String(id), todo)).data;
}
