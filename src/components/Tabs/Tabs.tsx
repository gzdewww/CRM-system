import type { TodoInfo } from "../../types/TodoTypes";
import styles from "./Tabs.module.scss";

type Props = {
  info?: TodoInfo;
  activeTab: string;
  setActiveTab: (tab: keyof TodoInfo) => void;
};

const tabLabel: Record<keyof TodoInfo, string> = {
  all: "Все",
  inWork: "Активные",
  completed: "Выполненные",
};

const keys: (keyof TodoInfo)[] = Object.keys(tabLabel) as (keyof TodoInfo)[];

export default function Tabs({
  info = { all: 0, inWork: 0, completed: 0 },
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <nav className={styles.tabs}>
      <ul className={styles.tabs__list}>
        {keys.map((tab) => (
          <li
            key={tab}
            tabIndex={0}
            className={`${styles.tabs__item} ${
              activeTab === tab ? styles["tabs__item--active"] : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {`${tabLabel[tab]} (${info[tab]})`}
          </li>
        ))}
      </ul>
    </nav>
  );
}
