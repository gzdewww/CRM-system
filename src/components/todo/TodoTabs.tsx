import { Badge, Space, Tabs } from "antd";
import { TODO_TAB_COLOR, TODO_TAB_LABEL } from "../../constants/todo.const";
import typedKeys from "../../helpers/typedKeys";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { TodoInfo } from "../../types/todo.types";
import { setActiveTab } from "../../store/slices/todo/todoSlice";
import { selectActiveTab, selectTodos } from "../../store/slices/todo/todoSelectors";

export default function TodoTabs() {
  const { data: todosData } = useAppSelector(selectTodos);
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();

  return (
    <Tabs
      moreIcon={null}
      centered
      activeKey={activeTab}
      onChange={(key) => dispatch(setActiveTab(key as keyof TodoInfo))}
      items={typedKeys(todosData?.info ?? []).map((tab) => ({
        label: (
          <Space>
            <span>{TODO_TAB_LABEL[tab]}</span>
            <Badge count={todosData?.info?.[tab]} color={TODO_TAB_COLOR[tab]} />
          </Space>
        ),
        key: tab,
      }))}
    />
  );
}
