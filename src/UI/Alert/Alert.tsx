import styles from "./Alert.module.scss";

type Props = {
  message: string;
  type: "success" | "error";
};

export default function Alert({ message, type }: Props) {
  return (
    <div className={styles.alert} data-alert-type={type}>
      {message}
    </div>
  );
}
