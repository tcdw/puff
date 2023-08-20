import React, { forwardRef } from "react";
import { bem } from "@/utils/style";
import "./Paper.scss";

export interface PaperChildrenWrapperProps {
    children: React.ReactNode
}

export interface PaperProps {
    width?: string
    height?: string
    landscape?: boolean
    className?: string
    style?: React.CSSProperties
    childrenWrapper?: React.FC<PaperChildrenWrapperProps>
}

const Paper = forwardRef<HTMLDivElement, React.PropsWithChildren<PaperProps>>((props, ref) => (
    <div
        ref={ref}
        style={{
            "--puff-paper-width": props.width,
            "--puff-paper-height": props.height,
            ...props.style,
        } as React.CSSProperties}
        className={`${bem("puff-paper", null, {
            landscape: props.landscape,
        })} ${props.className || ""}`}
    >
        {props.childrenWrapper && props.childrenWrapper({
            children: props.children,
        })}
    </div>
));

Paper.displayName = "Paper";
Paper.defaultProps = {
    width: "",
    height: "",
    landscape: false,
    className: "",
    style: {},
    childrenWrapper: (options) => options.children,
};

export default Paper;
