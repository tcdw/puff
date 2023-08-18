import React from "react";

export interface PuffFragment {
    element: React.ReactElement
    key: string
}

export interface PuffPaper {
    paperElement: React.ReactElement
    paperItems: PuffFragment[]
    key: string
}
