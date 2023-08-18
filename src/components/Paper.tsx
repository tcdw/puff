import React, { forwardRef } from "react";
import { bem } from "@/utils/style";
import "./Paper.scss";

export interface PaperProps {
    width?: string
    height?: string
    landscape?: boolean
    beforeElement?: React.ReactElement
    afterElement?: React.ReactElement
}

const Paper = forwardRef<HTMLDivElement, React.PropsWithChildren<PaperProps>>((props, ref) => (
    <div
        ref={ref}
        style={{
            "--puff-paper-width": props.width,
            "--puff-paper-height": props.height,
        } as React.CSSProperties}
        className={bem("puff-paper", null, {
            landscape: props.landscape,
        })}
    >
        {props.beforeElement}
        {props.children}
        {props.afterElement}
    </div>
));

Paper.displayName = "Paper";
Paper.defaultProps = {
    beforeElement: undefined,
    afterElement: undefined,
    width: "",
    height: "",
    landscape: false,
};

export default Paper;
