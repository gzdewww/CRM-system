import axios from "axios";
import type {
  MetaResponse,
  Todo,
  TodoInfo,
  TodoRequest,
} from "../types/todo.types";

const TODO_URL = import.meta.env.VITE_TODO_API_URL;

export async function getTodos(
  filter?: keyof TodoInfo
): Promise<MetaResponse<Todo, TodoInfo>> {
  return await axios
    .get(`${TODO_URL}${filter ? `?filter=${filter}` : ""}`)
    .then((response) => response.data);
}

export async function addTodo(title: string): Promise<Todo> {
  const todo: TodoRequest = {
    title,
    isDone: false,
  };

  return axios.post(TODO_URL, todo).then((response) => response.data);
}

export async function deleteTodo(id: number): Promise<number> {
  return axios.delete(`${TODO_URL}/${id}`).then((response) => response.status);
}

export async function updateTodo(id: number, todo: TodoRequest): Promise<Todo> {
  return axios.put(`${TODO_URL}/${id}`, todo).then((response) => response.data);
}
