import logo from "../assets/nevis-logo.svg";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img className={styles.logo} src={logo} alt="Nevis" />
    </footer>
  );
};
