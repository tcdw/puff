import React, {
    cloneElement, forwardRef, useImperativeHandle, useRef, useState,
} from "react";

import { v4 } from "uuid";
import { flushSync } from "react-dom";
import sleep from "sleep-promise";
import { normalizeList } from "@/utils/misc";
import { measureSize } from "@/utils/style";
import { flattenDeep, isNil } from "lodash-es";
import type { PuffPaper, PuffFragment } from "@/types/puff";

export interface RenderOptions {
    slow?: boolean
}

export interface RenderReturns {
    rotatePages: number[]
}

export type DocumentChildren = React.ReactElement | null | undefined;

export interface DocumentProps {
    children: DocumentChildren | DocumentChildren[]
}

export interface DocumentRef {
    render: (options?: RenderOptions) => Promise<RenderReturns>
    clear: () => void
}

const Document = forwardRef<DocumentRef, DocumentProps>((props, ref) => {
    const [items, setItems] = useState<PuffPaper[]>([]);
    const paperRef = useRef<HTMLDivElement[]>([]);

    const render = async (options: RenderOptions = {}) => {
        console.time("渲染性能");
        let renderCount = 0;

        const rawPuffPapers: PuffPaper[] = [];

        // 遍历纸张原始 JSX 结构，渲染成 PuffPaper 数据结构
        const documentChildren = flattenDeep(normalizeList(props.children)).filter((e) => !isNil(e));

        // i => 纸张 index
        for (let i = 0; i < documentChildren.length; i++) {
            const paper: React.ReactElement = documentChildren[i]!;
            console.log("paper", paper);
            const puffPaper: PuffPaper = {
                paperElement: cloneElement(paper, {}, undefined),
                paperItems: [],
                key: v4(),
                renderAmount: 1,
            };

            // 遍历纸张上的元素
            const paperChildren = flattenDeep(normalizeList(paper.props.children)).filter((e) => !isNil(e));

            // j => 纸张元素 index
            for (let j = 0; j < paperChildren.length; j++) {
                // 先尝试增加元素
                const paperItem: React.ReactElement = paperChildren[j]!;
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
            renderCount++;
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
                    // 由于 Firefox 和 Chrome 浏览器的测量结果存在极小的差异，导致页面渲染工作不可靠，这里统一换算成整数
                    paperActualHeight = Math.floor(paperRef.current[i].getBoundingClientRect().height);
                    paperHeight = Math.floor(measureSize(e.paperElement.props.landscape ? "var(--puff-paper-width)" : "var(--puff-paper-height)"));
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
                        // 隐藏尾部
                        f.element = cloneElement(f.element, { hideAfter: true });

                        // 获取 elements 数量
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
                                element: cloneElement(movedFragment[0].element, { hideBefore: false, hideAfter: false }),
                                renderAmount: 0,
                            });
                            // 被渲染的页面数量 -1
                            e.renderAmount--;
                            break;
                        }

                        let notOverflowHandledFlag = false;
                        do {
                            if (options.slow) {
                                await sleep(100);
                            }

                            // 逐步添加文字
                            f.renderAmount += 25;
                            // 如果不慎超出总元素数量，要以总元素数量为准
                            f.renderAmount = Math.min(f.renderAmount, f.element.props.children.length);

                            // 执行更新
                            update();

                            // 更新完毕后测量高度
                            measureHeight();

                            // 兜底措施：去除尾部以后页面反而不会溢出
                            if (f.renderAmount > elements.length) {
                                // 将元素放到下一页
                                const movedFragment: PuffFragment = {
                                    element: cloneElement(f.element, { hideBefore: true, hideAfter: false }, []),
                                    key: v4(),
                                    renderAmount: 0,
                                };
                                nextPageFragments.push(movedFragment);
                                notOverflowHandledFlag = true;
                                break;
                            }
                        } while (paperActualHeight <= paperHeight);

                        if (notOverflowHandledFlag) {
                            // 将切出来的元素放到下一页
                            const movedFragments = e.paperItems.splice(j + 1, e.paperItems.length - j);
                            nextPageFragments.push(...movedFragments);
                            break;
                        }

                        do {
                            if (options.slow) {
                                await sleep(100);
                            }

                            // 逐步减少文字
                            f.renderAmount -= 1;

                            // 执行更新
                            update();

                            // 更新完毕后测量高度
                            measureHeight();
                        } while (paperActualHeight > paperHeight);

                        // 删除多出来的一个元素
                        // f.renderAmount -= 1;

                        // 将切出来的元素放到下一页
                        const movedFragment: PuffFragment = {
                            element: cloneElement(f.element, { hideBefore: true, hideAfter: false }, f.element.props.children.slice(f.renderAmount)),
                            key: v4(),
                            renderAmount: 0,
                        };
                        nextPageFragments.push(movedFragment);

                        // 将剩余元素放到下一页
                        const movedFragments = e.paperItems.splice(j + 1, e.paperItems.length - j);
                        nextPageFragments.push(...movedFragments);
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
        console.log(`渲染次数: ${renderCount}`);

        const rotatePages = rawPuffPapers
            .map((e, i) => ({ e, i }))
            .filter(({ e }) => e.paperElement.props.landscape)
            .map(({ i }) => i + 1);

        return { rotatePages };
    };

    const clear = () => {
        setItems([]);
    };

    useImperativeHandle(ref, () => ({
        render,
        clear,
    }), []);

    return (
        <>
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
        </>
    );
});

Document.displayName = "Document";

export default Document;
