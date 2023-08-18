import React from "react";
import styles from "./PageBlockA.module.css";
import type { PuffFragmentProps } from "@/types/puff";

const PageBlockA: React.FC<PuffFragmentProps & { word?: React.ReactNode }> = ({ word }) => (
    <div className={styles.main} style={{ height: "200px" }}>
        PageBlockA
        {word}
    </div>
);

PageBlockA.defaultProps = {
    word: "",
};
export default PageBlockA;
