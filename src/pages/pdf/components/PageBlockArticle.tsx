import React from "react";
import type { PuffFragmentProps } from "@/types/puff";

export interface PageBlockArticleProps {
    children?: React.ReactNode
}

const PageBlockArticle: React.FC<PuffFragmentProps & PageBlockArticleProps> = ({ children, hideBefore, hideAfter }) => (
    <div
        style={{
            background: "white",
            fontSize: "1.5rem",
        }}
    >
        <div
            style={{
                background: "green",
                color: "white",
                padding: "1rem",
                display: hideBefore ? "hidden" : undefined,
            }}
        >
            我是头部
        </div>
        <div style={{ padding: "1rem" }}>
            {children}
        </div>
        <div
            style={{
                background: "yellow",
                color: "black",
                padding: "1rem",
                display: hideAfter ? "hidden" : undefined,
            }}
        >
            我是尾部
        </div>
    </div>
);

PageBlockArticle.defaultProps = {
    children: undefined,
};

export default PageBlockArticle;
