import type { ThemeConfig } from "antd";
import { colors } from "./colors";

export const token: ThemeConfig["token"] = {
  colorPrimary: colors.primary,

  colorError: colors.error,

  colorSuccess: colors.success,

  colorWarning: colors.warning,

  borderRadius: 8,
  fontSize: 16,
};
