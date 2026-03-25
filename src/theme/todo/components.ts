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

  Select: {
    optionSelectedBg: "#e6f4ff",
    optionSelectedColor: "rgba(0,0,0,0.88)",
    optionActiveBg: "rgba(0,0,0,0.04)",
  },
};
