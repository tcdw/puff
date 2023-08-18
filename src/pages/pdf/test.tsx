import React, { cloneElement, useRef, useState } from "react";

import { v4 } from "uuid";
import { flushSync } from "react-dom";
import Paper from "@/components/Paper";
import { normalizeList } from "@/utils/misc";
import { measureSize } from "@/utils/style";
import PageBlockA from "./components/PageBlockA";
import PageBlockB from "./components/PageBlockB";
import type { PuffPaper, PuffFragment } from "@/types/puff";

const document: React.ReactNode = (
    <div>
        <Paper>
            <PageBlockB word="第一页第一个元素" />
            <PageBlockA />
            <PageBlockA />
            <PageBlockA />
            <PageBlockA />
            <PageBlockA />
            <PageBlockA />
            <PageBlockB />
            <PageBlockB />
            <PageBlockB />
            <PageBlockB />
            <PageBlockB word="第一页最后一个元素" />
        </Paper>
        <Paper>
            <PageBlockB word="第二页第一个元素" />
            <PageBlockA />
            <PageBlockA />
            <PageBlockB word="第二页最后一个元素" />
        </Paper>
    </div>
);

const Component: React.FC = () => {
    const [items, setItems] = useState<PuffPaper[]>([]);
    const paperRef = useRef<HTMLDivElement[]>([]);

    const handleRender = () => {
        const rawPuffPapers: PuffPaper[] = [];

        // 遍历纸张原始 JSX 结构，渲染成 PuffPaper 数据结构
        const documentChildren = normalizeList(document.props.children);

        // i => 纸张 index
        for (let i = 0; i < documentChildren.length; i++) {
            const paper: React.ReactElement = documentChildren[i];
            const puffPaper: PuffPaper = {
                paperElement: cloneElement(paper, {}, undefined),
                paperItems: [],
                key: v4(),
                renderAmount: 1,
            };

            // 遍历纸张上的元素
            const paperChildren = normalizeList(paper.props.children);

            // j => 纸张元素 index
            for (let j = 0; j < paperChildren.length; j++) {
                // 先尝试增加元素
                const paperItem: React.ReactElement = paperChildren[j];
                puffPaper.paperItems.push({
                    element: paperItem,
                    key: v4(),
                    renderAmount: 1,
                });

                /* // 确保执行完更新操作以后，DOM 也已经更新完毕，因为我们需要测量 DOM 高度
                flushSync(() => {
                    setItems((prevState) => {
                        prevState[i] = puffPaper;
                        return prevState.map((e) => e);
                    });
                });

                // 纸张是否已经溢出？
                const paperActualHeight = paperRef.current[i].getBoundingClientRect().height;
                const paperHeight = measureSize(paper.props.landscape ? "var(--puff-paper-width)" : "var(--puff-paper-height)");
                if (paperActualHeight > paperHeight) {
                    // 纸张溢出了！
                    console.log("纸张溢出了！", paperActualHeight, paperHeight);
                }
                j++; */
            }

            /* setItems((prevState) => {
                prevState.push(puffPaper);
                return prevState.map((e) => e);
            }); */

            rawPuffPapers.push(puffPaper);
        }

        // 开始进行渲染操作
        for (let i = 0; i < rawPuffPapers.length; i++) {
            const e = rawPuffPapers[i];

            for (let j = 0; j < e.paperItems.length; j++) {
                const f = e.paperItems[j];

                // 确保执行完更新操作以后，DOM 也已经更新完毕，因为我们需要测量 DOM 高度
                flushSync(() => {
                    setItems(rawPuffPapers.map((g) => g));
                });

                const paperActualHeight = paperRef.current[i].getBoundingClientRect().height;
                const paperHeight = measureSize(e.paperElement.props.landscape ? "var(--puff-paper-width)" : "var(--puff-paper-height)");
                if (paperActualHeight > paperHeight) {
                    // 纸张溢出了！
                    console.log("纸张溢出了！", paperActualHeight, paperHeight);
                }
                e.renderAmount++;
            }
        }
    };

    return (
        <div>
            {items.map((e, i) => {
                const childList = e.paperItems.slice(0, e.renderAmount).map((f) => cloneElement(f.element, { key: f.key }));
                return cloneElement(e.paperElement, {
                    key: e.key,
                    ref: (el: HTMLDivElement) => {
                        paperRef.current[i] = el;
                    },
                }, ...childList);
            })}
            <button type="button" onClick={handleRender}>handleRender</button>
        </div>
    );
};

export default Component;
