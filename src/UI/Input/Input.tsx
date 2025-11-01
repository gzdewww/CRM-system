import clsx from "clsx";
import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  placeholder?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function Input({
  value,
  placeholder,
  error,
  onChange,
  className,
  ref,
  ...props
}: InputProps) {
  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={error || placeholder}
      aria-invalid={Boolean(error)}
      className={clsx(styles.input, className, error && styles["input--error"])}
      {...props}
    />
  );
}
