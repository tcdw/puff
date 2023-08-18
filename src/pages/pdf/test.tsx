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
            <PageBlockA word={1} />
            <PageBlockA word={2} />
            <PageBlockA word={3} />
            <PageBlockA word={4} />
            <PageBlockA word={5} />
            {/* <PageBlockB word={5000} /> */}
            <PageBlockA word={6} />
            <PageBlockB word={7} />
            <PageBlockB word={8} />
            <PageBlockB word={9} />
            <PageBlockB word={10} />
            <PageBlockB word="第一页最后一个元素" />
        </Paper>
        <Paper>
            <PageBlockB word="第二页第一个元素" />
            <PageBlockA word={1} />
            <PageBlockA word={2} />
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
            }
            rawPuffPapers.push(puffPaper);
        }

        // 开始进行渲染操作
        for (let i = 0; i < rawPuffPapers.length; i++) {
            const e = rawPuffPapers[i];

            // 要放置到下一页的 PuffFragment
            const nextPageFragments: PuffFragment[] = [];
            for (let j = 0; j < e.paperItems.length;) {
                const f = e.paperItems[j];

                // 确保执行完更新操作以后，DOM 也已经更新完毕，因为我们需要测量 DOM 高度
                flushSync(() => {
                    setItems(rawPuffPapers.map((g) => g));
                });

                const paperActualHeight = paperRef.current[i].getBoundingClientRect().height;
                const paperHeight = measureSize(e.paperElement.props.landscape ? "var(--puff-paper-width)" : "var(--puff-paper-height)");
                if (paperActualHeight > paperHeight) {
                    // 纸张溢出了！
                    console.log("纸张溢出了！", {
                        i, j, paperActualHeight, paperHeight,
                    });

                    // 将当前 j 指向的 Fragment 挪动到 nextPageFragments 的末尾
                    // const movedFragment = e.paperItems.splice(j, 1);
                    // nextPageFragments.push(movedFragment[0]); // 只有一个元素会被删除

                    // 将当前 j 及之后指向的 Fragment 挪动到 nextPageFragments 的末尾
                    const movedFragment = e.paperItems.slice(j);
                    nextPageFragments.push(...movedFragment);

                    // 被渲染的页面数量 -1
                    e.renderAmount--;

                    break;
                } else {
                    // 被渲染的页面数量 +1
                    e.renderAmount++;
                    // 增加当前循环位置
                    j++;
                }
            }
            // 如果 nextPageFragments 有东西，插入到 rawPuffPapers
            if (nextPageFragments.length > 0) {
                rawPuffPapers.splice(i + 1, 0, {
                    paperElement: cloneElement(e.paperElement),
                    key: v4(),
                    paperItems: nextPageFragments,
                    renderAmount: 1,
                });
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
