import React from "react";

export interface Column<T> {
    id?: string;
    render: (data: T) => React.ReactNode | React.ReactElement | React.ReactPortal | string | number | boolean | null | undefined;
    alias: keyof T;
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;

}