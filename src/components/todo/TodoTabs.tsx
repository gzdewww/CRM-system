import { Badge, Space, Tabs } from "antd";
import { TODO_TAB_COLOR, TODO_TAB_LABEL } from "../../constants/todo.const";
import typedKeys from "../../helpers/typedKeys";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setActiveTab } from "../../store/slices/todosSlice";
import type { TodoInfo } from "../../types/todo.types";

export default function TodoTabs() {
  const activeTab = useAppSelector((state) => state.todos.activeTab);
  const info = useAppSelector((state) => state.todos.info);
  const dispatch = useAppDispatch();

  return (
    <Tabs
      moreIcon={null}
      centered
      activeKey={activeTab}
      onChange={(key) => dispatch(setActiveTab(key as keyof TodoInfo))}
      items={typedKeys(info).map((tab) => ({
        label: (
          <Space>
            <span>{TODO_TAB_LABEL[tab]}</span>
            <Badge count={info[tab]} color={TODO_TAB_COLOR[tab]} />
          </Space>
        ),
        key: tab,
      }))}
    />
  );
}
