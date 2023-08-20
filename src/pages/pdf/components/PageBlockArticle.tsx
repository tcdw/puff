import React from "react";
import type { PuffFragmentProps } from "@/types/puff";
import styles from "./PageBlockArticle.module.css";

export interface PageBlockArticleProps {
    children?: React.ReactNode
}

const PageBlockArticle: React.FC<PuffFragmentProps & PageBlockArticleProps> = ({ children, hideBefore, hideAfter }) => (
    <div className={styles.root}>
        <div
            className={styles.header}
            style={{ display: hideBefore ? "none" : undefined }}
        >
            我是头部
        </div>
        <div className={styles.common}>
            {children}
        </div>
        <div
            className={styles.footer}
            style={{ display: hideAfter ? "none" : undefined }}
        >
            我是尾部
        </div>
    </div>
);

PageBlockArticle.defaultProps = {
    children: undefined,
};

export default PageBlockArticle;
