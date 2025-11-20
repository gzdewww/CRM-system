import type { ThemeConfig } from "antd";

export const components: ThemeConfig["components"] = {
  Input: {
    colorBgContainer: "transparent",
  },

  List: {
    itemPadding: ".25rem 0",
    contentWidth: "100%",
  },

  Checkbox: {
    controlInteractiveSize: 24,
  },

  Menu: {
    activeBarBorderWidth: 0,
  },
};
