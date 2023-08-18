import React, { useState } from "react";
import PageBlockA from "@/pages/pdf/components/PageBlockA";
import PageBlockB from "@/pages/pdf/components/PageBlockB";
import { flushSync } from "react-dom";

const Component: React.FC = () => {
    const [items, setItems] = useState([
        {
            component: PageBlockA,
            props: {}
        },
        {
            component: PageBlockB,
            props: {}
        },
        {
            component: PageBlockB,
            props: { word: "test" }
        }
    ])

    const handleClick = () => {
        flushSync(() => {
            setItems((prevState) => {
                prevState.push({
                    component: PageBlockB,
                    props: { word: "test" + new Date().getTime() }
                })
                return prevState.map((e) => e);
            })
        })
    }

    return (
        <div>
            {items.map((e, i) => {
                const DynamicComponent = e.component;
                return <DynamicComponent key={i} {...e.props} />
            })}
            <button onClick={handleClick}>Add</button>
        </div>
    )
}

export default Component;
