import { colors } from "../theme";
import type { TodoInfo } from "../types/todo.types";

const tabLabel: Record<keyof TodoInfo, string> = {
  all: "Все",
  inWork: "Активные",
  completed: "Выполненные",
} as const;

const tabColor: Record<keyof TodoInfo, string> = {
  all: colors.primary,
  inWork: colors.warning,
  completed: colors.success,
} as const;

export { tabLabel, tabColor };
