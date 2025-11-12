import { type ThemeConfig } from "antd";
import { colors } from "./colors";
import { components } from "./components";
import { token } from "./token";

export const lightTheme: ThemeConfig = {
  token: {
    ...token,
    colorBgBase: colors.lightBase,
    colorTextBase: colors.darkBase,
  },
  components,
};

export const darkTheme: ThemeConfig = {
  token: {
    ...token,
    colorBgBase: colors.darkBase,
    colorTextBase: colors.lightBase,
  },
  components,
};
