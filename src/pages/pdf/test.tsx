import React, { cloneElement, useState } from "react";

import Paper from "@/components/Paper";
import { normalizeList } from "@/utils/misc";
import PageBlockA from "./components/PageBlockA";
import PageBlockB from "./components/PageBlockB";
import type { PuffPaper } from "@/types/puff";

const document: React.ReactNode = (
    <div>
        <Paper>
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
            <PageBlockB word="test" />
        </Paper>
        <Paper>
            <PageBlockA />
            <PageBlockA />
            <PageBlockB word="test" />
        </Paper>
    </div>
);

const Component: React.FC = () => {
    const [items, setItems] = useState<PuffPaper[]>([]);

    const handleRender = () => {
        // 遍历纸张
        const documentChildren = normalizeList(document.props.children);
        for (let i = 0; i < documentChildren.length; i++) {
            const paper: React.ReactElement = documentChildren[i];
            const puffPaper: PuffPaper = {
                paperElement: cloneElement(paper, {}, undefined),
                paperItems: [],
                key: `${Math.random()}`,
            };

            // 遍历纸张上的元素
            const paperChildren = normalizeList(paper.props.children);
            for (let j = 0; j < paperChildren.length; j++) {
                const paperItem: React.ReactElement = paperChildren[j];
                puffPaper.paperItems.push({
                    element: paperItem,
                    key: `${Math.random()}`,
                });
            }

            setItems((prevState) => {
                prevState.push(puffPaper);
                return prevState.map((e) => e);
            });
        }
    };

    return (
        <div>
            {items.map((e) => cloneElement(e.paperElement, { key: e.key }, ...e.paperItems.map((f) => cloneElement(f.element, { key: f.key }))))}
            <button type="button" onClick={handleRender}>handleRender</button>
        </div>
    );
};

export default Component;
