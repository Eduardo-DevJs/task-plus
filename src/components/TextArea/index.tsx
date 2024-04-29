import { HTMLProps } from "react";
import styles from "./styles.module.css";

export default function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
  return <textarea {...rest} className={styles.textarea}></textarea>;
}
