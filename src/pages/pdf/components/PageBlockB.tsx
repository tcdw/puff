import React from "react";
import styles from "./PageBlockA.module.css";
import type { PuffFragmentProps } from "@/types/puff";

const PageBlockB: React.FC<PuffFragmentProps & { word?: React.ReactNode }> = ({ word }) => (
    <div className={styles.main}>
        PageBlockB test
        {word}
    </div>
);

PageBlockB.defaultProps = {
    word: "",
};

export default PageBlockB;
