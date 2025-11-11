import { colors } from "../theme/colors";
import type { TodoInfo } from "../types/todo.types";

const TODO_TAB_LABEL: Record<keyof TodoInfo, string> = {
  all: "Все",
  inWork: "Активные",
  completed: "Выполненные",
} as const;

const TODO_TAB_COLOR: Record<keyof TodoInfo, string> = {
  all: colors.primary,
  inWork: colors.warning,
  completed: colors.success,
} as const;

const TODO_TITLE_LENGTH = {
  min: 2,
  max: 64,
};

export { TODO_TAB_LABEL as tabLabel, TODO_TAB_COLOR as tabColor, TODO_TITLE_LENGTH as titleLength };
