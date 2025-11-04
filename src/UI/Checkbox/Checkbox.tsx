import { BsCheckLg } from "react-icons/bs";
import styles from "./Checkbox.module.scss";

type Props = {
  isDone: boolean;
  onToggle: () => void;
};

export default function Checkbox({ isDone, onToggle }: Props) {
  return (
    <label className={styles.checkbox}>
      <input
        className={styles.checkbox__input}
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
        aria-checked={isDone}
        name="Task checkbox"
      />
      <BsCheckLg className={styles.checkbox__icon} />
    </label>
  );
}
