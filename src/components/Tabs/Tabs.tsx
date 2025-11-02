import { clsx } from "clsx";
import type { TodoInfo } from "../../types/TodoInfo";
import styles from "./Tabs.module.scss";

type Props = {
  info?: TodoInfo;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const keys: (keyof TodoInfo)[] = ["all", "inWork", "completed"];

const dictionary: Record<keyof TodoInfo, string> = {
  all: "Все",
  inWork: "Активные",
  completed: "Выполненные",
};

export default function Tabs({
  info = { all: 0, inWork: 0, completed: 0 },
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className={styles.tabs}>
      <nav className={styles.tabs__nav}>
        <ul className={styles.tabs__list}>
          {keys.map((tab) => (
            <li
              key={tab}
              tabIndex={0}
              className={clsx(
                styles.tabs__item,
                activeTab === tab && styles["tabs__item--active"]
              )}
              onClick={() => setActiveTab(tab)}
            >
              {`${dictionary[tab]} (${info[tab]})`}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
