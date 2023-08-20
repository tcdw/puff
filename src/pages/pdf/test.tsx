import React, { useRef, useState } from "react";

import Paper, { PaperChildrenWrapperProps } from "@/components/Paper";
import PageBlockArticle from "@/pages/pdf/components/PageBlockArticle";
import Document, { DocumentRef } from "@/components/Document";
import PageBlockA from "./components/PageBlockA";
import PageBlockB from "./components/PageBlockB";
import styles from "./test.module.scss";
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

    const [testSwitch, setTestSwitch] = useState(true);

    const handleRender = async () => {
        const result = await documentRef.current?.render({ slow: false });
        console.log("渲染完毕！要旋转的页面页码:", result?.rotatePages);
    };

    const handleClear = () => {
        documentRef.current?.clear();
    };

    const handleToggleTestSwitch = () => {
        setTestSwitch((prevState) => !prevState);
    };

    return (
        <div>
            <div className={styles.floatingAction}>
                <button
                    type="button"
                    onClick={handleRender}
                >
                    handleRender
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                >
                    handleClear
                </button>
                <button
                    type="button"
                    onClick={handleToggleTestSwitch}
                >
                    {`handleToggleTestSwitch (Current: ${testSwitch})`}
                </button>
            </div>
            <Document ref={documentRef} key={`${testSwitch}`}>
                {testSwitch ? null : (
                    <Paper>
                        <PageBlockB word="第三页第一个元素。本页面在 testSwitch 为 false 时会显示" />
                    </Paper>
                )}
                <Paper landscape>
                    <PageBlockB word="第零页第一个元素" />
                    {/* eslint-disable-next-line react/no-array-index-key */}
                    {new Array(5).fill("a").map((e, i) => <PageBlockB word={`循环列表 ${i}`} key={`循环列表${e}${i}`} />)}
                    <PageBlockArticle>{new Array(500).fill("小曹铁路好！！！").map((e, i) => e + (i + 1)).join("")}</PageBlockArticle>
                </Paper>
                {testSwitch ? (
                    <Paper className={styles.testChildrenWrapper} childrenWrapper={CustomChildrenWrapper}>
                        <PageBlockB word="第一页第一个元素。本页面在 testSwitch 为 true 时会显示" />
                        <PageBlockA word={1} />
                        <PageBlockB word={2} />
                        <PageBlockArticle>{text}</PageBlockArticle>
                        <PageBlockA word={3} />
                        <PageBlockA word={4} />
                        <PageBlockB word="第一页最后一个元素" />
                    </Paper>
                ) : null}
                <Paper>
                    <PageBlockB word="第二页第一个元素" />
                    <PageBlockA word={1} />
                    <PageBlockA word={2} />
                    {testSwitch ? null : <PageBlockA word={`${3}（在 testSwitch 为 false 时会显示）`} />}
                    {testSwitch ? <PageBlockA word={`${3}（在 testSwitch 为 true 时会显示）`} /> : undefined}
                    <PageBlockB word="第二页最后一个元素" />
                </Paper>
            </Document>
        </div>
    );
};

export default Component;
