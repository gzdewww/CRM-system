import { clsx } from "clsx";
import { useState } from "react";
import type { MetaResponse } from "../../types/MetaResponse";
import type { Todo } from "../../types/Todo";
import type { TodoInfo } from "../../types/TodoInfo";
import TodoList from "../TodoList/TodoList";
import styles from "./Tabs.module.scss";

type Props = {
  meta: MetaResponse<Todo, TodoInfo>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title?: string, isDone?: boolean) => Promise<void>;
};

export default function Tabs({ meta, onDelete, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.tabs}>
      <nav className={styles.tabs__nav}>
        <ul className={styles.tabs__list}>
          <li
            tabIndex={0}
            className={clsx(
              styles.tabs__item,
              activeTab === 0 && styles["tabs__item--active"]
            )}
            onClick={() => setActiveTab(0)}
          >
            All ({meta.info?.all})
          </li>
          <li
            tabIndex={0}
            className={clsx(
              styles.tabs__item,
              activeTab === 1 && styles["tabs__item--active"]
            )}
            onClick={() => setActiveTab(1)}
          >
            In Progress ({meta.info?.inWork})
          </li>
          <li
            tabIndex={0}
            className={clsx(
              styles.tabs__item,
              activeTab === 2 && styles["tabs__item--active"]
            )}
            onClick={() => setActiveTab(2)}
          >
            Done ({meta.info?.completed})
          </li>
        </ul>
      </nav>
      <main className={styles.tabs__content}>
        <TodoList
          todos={meta.data}
          onUpdate={onUpdate}
          onDelete={onDelete}
          style={{
            transform: `translateX(-${activeTab * 100}%)`,
            opacity: +(activeTab === 0),
          }}
        />
        <TodoList
          todos={meta.data.filter((todo) => !todo.isDone)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          style={{
            transform: `translateX(-${activeTab * 100}%)`,
            opacity: +(activeTab === 1),
          }}
        />
        <TodoList
          todos={meta.data.filter((todo) => todo.isDone)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          style={{
            transform: `translateX(-${activeTab * 100}%)`,
            opacity: +(activeTab === 2),
          }}
        />
      </main>
    </div>
  );
}
