import React, { useRef } from "react";

import Paper, { PaperChildrenWrapperProps } from "@/components/Paper";
import PageBlockArticle from "@/pages/pdf/components/PageBlockArticle";
import Document, { DocumentRef } from "@/components/Document";
import PageBlockA from "./components/PageBlockA";
import PageBlockB from "./components/PageBlockB";
import styles from "./test.module.css";
import text from "./test.txt";

const CustomChildrenWrapper: React.FC<PaperChildrenWrapperProps> = ({ children }) => (
    <>
        <div style={{ padding: "0.5rem", textAlign: "center" }}>我是页眉</div>
        {children}
        <div style={{ padding: "0.5rem", textAlign: "center", marginTop: "auto" }}>我是页脚</div>
    </>
);

const Component: React.FC = () => {
    const documentRef = useRef<DocumentRef>(null);

    const handleRender = () => {
        documentRef.current?.render({ slow: true });
    };

    return (
        <div>
            <Document ref={documentRef}>
                <Paper landscape>
                    <PageBlockB word="第零页第一个元素" />
                    <PageBlockA word={1} />
                    <PageBlockA word={2} />
                    <PageBlockA word={3} />
                    <PageBlockA word={4} />
                    <PageBlockA word={5} />
                    <PageBlockArticle>{new Array(500).fill("小曹铁路好！！！").map((e, i) => e + (i + 1)).join("")}</PageBlockArticle>
                </Paper>
                <Paper className={styles.testChildrenWrapper} childrenWrapper={CustomChildrenWrapper}>
                    <PageBlockB word="第一页第一个元素" />
                    <PageBlockA word={1} />
                    <PageBlockA word={2} />
                    <PageBlockB word={3} />
                    <PageBlockArticle>{text}</PageBlockArticle>
                    <PageBlockA word={4} />
                    <PageBlockA word={5} />
                    <PageBlockA word={6} />
                    <PageBlockB word="第一页最后一个元素" />
                </Paper>
                <Paper>
                    <PageBlockB word="第二页第一个元素" />
                    <PageBlockA word={1} />
                    <PageBlockA word={2} />
                    <PageBlockB word="第二页最后一个元素" />
                </Paper>
            </Document>
            <button
                type="button"
                onClick={handleRender}
            >
                handleRender
            </button>
        </div>
    );
};

export default Component;
