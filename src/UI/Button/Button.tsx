import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "success"; //TODO: styles for each variant
}

export default function Button({ children, onClick, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      role="button"
      onClick={onClick}
      className={styles.button}
      data-variant={props.variant}
      {...props}
    >
      {children}
    </button>
  );
}
