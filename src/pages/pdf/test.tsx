import React, { cloneElement, useRef, useState } from "react";

import { v4 } from "uuid";
import { flushSync } from "react-dom";
import sleep from "sleep-promise";
import Paper from "@/components/Paper";
import { normalizeList } from "@/utils/misc";
import { measureSize } from "@/utils/style";
import PageBlockArticle from "@/pages/pdf/components/PageBlockArticle";
import PageBlockA from "./components/PageBlockA";
import PageBlockB from "./components/PageBlockB";
import type { PuffPaper, PuffFragment } from "@/types/puff";

const document: React.ReactNode = (
    <div>
        <Paper>
            <PageBlockB word="第零页第一个元素" />
            <PageBlockA word={1} />
            <PageBlockA word={2} />
            <PageBlockA word={3} />
            <PageBlockA word={4} />
            <PageBlockA word={5} />
            <PageBlockArticle>{new Array(500).fill("小曹铁路好！！！").map((e, i) => e + (i + 1)).join("")}</PageBlockArticle>
        </Paper>
        <Paper landscape>
            <PageBlockB word="第一页第一个元素" />
            <PageBlockA word={1} />
            <PageBlockA word={2} />
            <PageBlockB word={3} />
            <PageBlockArticle>{new Array(500).fill("小曹铁路好！！！").map((e, i) => e + (i + 1)).join("")}</PageBlockArticle>
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
    </div>
);

interface HandleRenderOptions {
    slow?: boolean
}

const Component: React.FC = () => {
    const [items, setItems] = useState<PuffPaper[]>([]);
    const paperRef = useRef<HTMLDivElement[]>([]);

    const handleRender = async (options: HandleRenderOptions = {}) => {
        console.time("渲染性能");

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
                    renderAmount: 0,
                });
            }
            rawPuffPapers.push(puffPaper);
        }

        const update = () => {
            flushSync(() => {
                setItems(rawPuffPapers.map((g) => g));
            });
        };

        // 开始进行渲染操作
        for (let i = 0; i < rawPuffPapers.length; i++) {
            if (options.slow) {
                await sleep(100);
            }

            // rawPuffPaper
            const e = rawPuffPapers[i];

            // 要放置到下一页的 PuffFragment
            const nextPageFragments: PuffFragment[] = [];

            for (let j = 0; j < e.paperItems.length;) {
                if (options.slow) {
                    await sleep(100);
                }

                // rawPuffPaper => paperItem
                const f = e.paperItems[j];

                // 确保执行完更新操作以后，DOM 也已经更新完毕，因为我们需要测量 DOM 高度
                update();

                let paperActualHeight = 0;
                let paperHeight = 0;

                const measureHeight = () => {
                    paperActualHeight = paperRef.current[i].getBoundingClientRect().height;
                    paperHeight = measureSize(e.paperElement.props.landscape ? "var(--puff-paper-width)" : "var(--puff-paper-height)");
                };
                measureHeight();

                let forceNextFlag = false;
                if (paperActualHeight > paperHeight) {
                    // 纸张溢出了！
                    console.log("纸张溢出了！", {
                        i, j, paperActualHeight, paperHeight,
                    });

                    // 如果是有元素的 Fragment
                    // console.log(f.element.props.children);
                    if (f.element.props.children) {
                        let elements: React.ReactNode[] = normalizeList(f.element.props.children);
                        if (typeof f.element.props.children === "string") {
                            elements = f.element.props.children.split("");
                        }

                        // 使用二分法进行元素拆分
                        f.renderAmount = elements.length;
                        do {
                            if (options.slow) {
                                await sleep(500);
                            }

                            if (f.renderAmount <= 1) {
                                console.warn("使用二分法删除后依然不工作，挤压到下一页");
                                forceNextFlag = true;
                                break;
                            }

                            // 尝试缩减
                            f.renderAmount = Math.ceil(f.renderAmount / 2);

                            // 执行更新
                            update();

                            // 更新完毕后测量高度
                            measureHeight();

                            console.log({
                                paperActualHeight,
                                paperHeight,
                                renderAmount: f.renderAmount,
                            });
                        } while (paperActualHeight > paperHeight);

                        // 将二分法失败的内容移动到下一页
                        if (forceNextFlag) {
                            // 将当前 j 及之后指向的 Fragment 挪动到 nextPageFragments 的末尾
                            const movedFragment = e.paperItems.splice(j, 1);
                            nextPageFragments.push({
                                ...movedFragment[0],
                                renderAmount: 0,
                            });
                            // 被渲染的页面数量 -1
                            e.renderAmount--;
                            break;
                        }

                        do {
                            if (options.slow) {
                                await sleep(100);
                            }

                            // 逐步添加文字
                            f.renderAmount += 5;

                            // 执行更新
                            update();

                            // 更新完毕后测量高度
                            measureHeight();
                        } while (paperActualHeight <= paperHeight);

                        do {
                            if (options.slow) {
                                await sleep(500);
                            }

                            // 逐步减少文字
                            f.renderAmount -= 1;

                            // 执行更新
                            update();

                            // 更新完毕后测量高度
                            measureHeight();
                        } while (paperActualHeight > paperHeight);

                        // 删除多出来的一个元素
                        f.renderAmount -= 1;

                        // 将剩下的元素放到下一页
                        const movedFragment: PuffFragment = {
                            element: cloneElement(f.element, {}, f.element.props.children.slice(f.renderAmount)),
                            key: v4(),
                            renderAmount: 0,
                        };
                        nextPageFragments.push(movedFragment);
                        break;
                    }

                    // 如果当前页面元素只有一个，执行兜底措施，防止不断挤压到下一页的死循环
                    if (e.renderAmount === 1) {
                        console.warn("由于页面中只有一个元素，无法再进行处理，执行兜底措施");
                        // 被渲染的页面数量 +1
                        e.renderAmount++;
                        // 增加当前循环位置
                        j++;
                        break;
                    }

                    // 将当前 j 及之后指向的 Fragment 挪动到 nextPageFragments 的末尾
                    const movedFragment = e.paperItems.splice(j, e.paperItems.length - j);
                    nextPageFragments.push(...movedFragment);

                    // 被渲染的页面数量 -1
                    e.renderAmount--;
                    break;
                }
                // 被渲染的页面数量 +1
                e.renderAmount++;
                // 增加当前循环位置
                j++;
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

        console.timeEnd("渲染性能");
    };

    return (
        <div>
            {items.map((e, i) => {
                const childList = e.paperItems
                    .slice(0, e.renderAmount)
                    .map((f) => cloneElement(f.element, { key: f.key }, (f.element.props.children || []).slice(0, f.renderAmount || undefined)));
                return cloneElement(e.paperElement, {
                    key: e.key,
                    ref: (el: HTMLDivElement) => {
                        paperRef.current[i] = el;
                    },
                }, ...childList);
            })}
            <button
                type="button"
                onClick={() => handleRender({ slow: false })}
                // style={{
                //     appearance: "none",
                //     padding: "40px",
                //     fontSize: "40px",
                // }}
            >
                handleRender
            </button>
        </div>
    );
};

export default Component;
