import type { ThemeConfig } from "antd";
import { colors } from "./colors";

export const token: ThemeConfig["token"] = {
  colorPrimary: colors.primary,
  colorError: colors.error,
  colorSuccess: colors.success,
  colorWarning: colors.warning,
  colorLink: colors.primary,
  colorTextBase: colors.textBase,
  controlHeight: 48,

  borderRadius: 6,
  fontSize: 16,
};
