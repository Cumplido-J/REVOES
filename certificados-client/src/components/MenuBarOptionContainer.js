import React from "react";
import styles from "./MenuBarOptionContainer.module.css";
const MenuBarOptionContainer = ({ children }) => {
  return <div className={styles.menuBarOptionContainer}>{children}</div>;
};
export default MenuBarOptionContainer;
