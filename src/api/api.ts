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
  timeout: 1000,
});

export async function getTodos(
  filter?: keyof TodoInfo
): Promise<MetaResponse<Todo, TodoInfo>> {
  return await todoInstance({ params: { filter } }).then(
    (response) => response.data
  );
}

export async function addTodo(title: string): Promise<Todo> {
  const todo: TodoRequest = {
    title,
    isDone: false,
  };

  return todoInstance.post("", todo).then((response) => response.data);
}

export async function deleteTodo(id: number): Promise<number> {
  return todoInstance.delete(String(id)).then((response) => response.status);
}

export async function updateTodo(id: number, todo: TodoRequest): Promise<Todo> {
  return todoInstance.put(String(id), todo).then((response) => response.data);
}
