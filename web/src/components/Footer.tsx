import logo from "../assets/nevis-logo.svg";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.left}>Take-home task</p>
      <img className={styles.logo} src={logo} alt="Nevis" />
      <p className={styles.right}>Web Engineer</p>
    </footer>
  );
};
