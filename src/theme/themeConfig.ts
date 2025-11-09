import { type ThemeConfig } from "antd";
import { components } from "./components";
import { token } from "./token";
import { colors } from "./colors";

export const lightTheme: ThemeConfig = {
  token: {
    ...token,
    colorBgBase: colors.light.bgBase,
    colorTextBase: colors.light.textBase,
  },
  components,
};

export const darkTheme: ThemeConfig = {
  token: {
    ...token,
    colorBgBase: colors.dark.bgBase,
    colorTextBase: colors.dark.textBase,
  },
  components,
};
