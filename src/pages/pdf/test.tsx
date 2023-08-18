import React, { useState } from "react";
import PageBlockA from "@/pages/pdf/components/PageBlockA";
import PageBlockB from "@/pages/pdf/components/PageBlockB";
import { flushSync } from "react-dom";

const Component: React.FC = () => {
    const [items, setItems] = useState([
        {
            element: <PageBlockA />,
            key: "1",
        },
        {
            element: <PageBlockB />,
            key: "2",
        },
        {
            element: <PageBlockB word="test" />,
            key: "3",
        }
    ])

    const handleAdd = () => {
        flushSync(() => {
            setItems((prevState) => {
                prevState.push({
                    element: <PageBlockB word={"test" + new Date().getTime()} />,
                    key: "__" + Math.random()
                })
                return prevState.map((e) => e);
            })
        })
    }

    const handleReplaceLast = () => {
        flushSync(() => {
            setItems((prevState) => {
                const last = prevState[prevState.length - 1];
                last.element = React.cloneElement(last.element, { word: "replaced " + new Date().getTime() })
                return prevState.map((e) => e);
            })
        })
    }

    return (
        <div>
            {items.map(( {element, key }) => {
                return React.cloneElement(element, { key })
            })}
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleReplaceLast}>ReplaceLast</button>
        </div>
    )
}

export default Component;
