import React from "react";
import styles from "./PageBlockA.module.css";

const PageBlockB: React.FC<{ word?: string }> = ({ word }) => {
    return <div className={styles.main}>PageBlockB test {word}</div>
}

export default PageBlockB;
