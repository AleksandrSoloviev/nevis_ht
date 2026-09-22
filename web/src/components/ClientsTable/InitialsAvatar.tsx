import styles from "./InitialsAvatar.module.css";

type InitialsAvatarProps = {
  name: string;
};

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export const InitialsAvatar = ({ name }: InitialsAvatarProps) => {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
};
