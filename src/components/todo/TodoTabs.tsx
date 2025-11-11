import { Badge, Space, Tabs } from "antd";
import { tabColor, tabLabel } from "../../constants/todo.const";
import typedKeys from "../../helpers/typedKeys";
import type { TodoInfo } from "../../types/todo.types";

type TodoTabsProps = {
  info?: TodoInfo;
  activeTab: string;
  setActiveTab: (tab: keyof TodoInfo) => void;
};

export default function TodoTabs({
  info = { all: 0, inWork: 0, completed: 0 },
  activeTab,
  setActiveTab,
}: TodoTabsProps) {
  return (
    <Tabs
      moreIcon={null}
      centered
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key as keyof TodoInfo)}
      items={typedKeys(info).map((tab) => ({
        label: (
          <Space>
            <span>{tabLabel[tab]}</span>
            <Badge count={info[tab]} color={tabColor[tab]} />
          </Space>
        ),
        key: tab,
      }))}
    />
  );
}
