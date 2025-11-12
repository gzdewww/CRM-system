import { CheckOutlined } from "@ant-design/icons";
import styles from "./Checkbox.module.scss";

type CheckboxProps = {
  isDone: boolean;
  onToggle: () => void;
};

export default function Checkbox({ isDone, onToggle }: CheckboxProps) {
  return (
    <label className={styles.checkbox}>
      <input
        className={styles.checkbox__input}
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
        aria-checked={isDone}
        name="checkbox"
      />
      <CheckOutlined className={styles.checkbox__icon} />
    </label>
  );
}
