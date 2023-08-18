import React from "react";

export interface PuffFragment {
    /**
     * 纸张内部元素
     */
    element: React.ReactElement
    /**
     * 纸张内部元素 children 渲染数量
     */
    renderAmount: number
    key: string
}

export interface PuffPaper {
    /**
     * 纸张本体元素
     */
    paperElement: React.ReactElement
    /**
     * 纸张内部元素组
     */
    paperItems: PuffFragment[]
    /**
     * 纸张内部元素渲染数量
     */
    renderAmount: number
    key: string
}

export interface PuffFragmentProps {
    hideBefore?: boolean
    hideAfter?: boolean
    handleChildren?: boolean
}
