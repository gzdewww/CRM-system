import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  placeholder?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  placeholder,
  error,
  onChange,
  ...props
}: InputProps) {
  return (
    <section className={styles.input}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={[
          styles.input__textfield,
          error ? styles["input__textfield--error"] : "",
        ].join(" ")}
        {...props}
      />
      <p className={styles.input__error} data-error={Boolean(error)}>
        {error}
      </p>
    </section>
  );
}
