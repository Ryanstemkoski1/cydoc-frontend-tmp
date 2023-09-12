import React, { useMemo } from 'react';
import MTable, { MaterialTableProps, Options } from '@material-table/core';

import { TABLE_ICONS } from '../Atoms/MaterialTableIcons';

export type ColumnSortInfo = { fieldName: string; direction: 'asc' | 'desc' };

interface Props<T extends object> extends MaterialTableProps<T> {
    loading?: boolean;
    onSelectionChange?: (items: T[]) => void;
    columnSortInfo?: ColumnSortInfo;
    tableId?: string;
}

export const materialTableHeight =
    ((window.innerHeight - 280) / window.innerHeight) * 100;

export default function MaterialTable<T extends object>({
    loading,
    options,
    onSelectionChange,
    title,
    columns,
    ...rest
}: Props<T>) {
    const tableOptions = useMemo(
        (): Options<T> => ({
            columnsButton: true,
            filtering: true,
            maxBodyHeight: `${materialTableHeight}vh`,
            minBodyHeight: `${materialTableHeight}vh`,
            pageSizeOptions: [25, 50, 100, 200],
            pageSize: 25,
            selection: !!onSelectionChange,
            maxColumnSort: 1,
            thirdSortClick: false,
            ...(options || {}),
        }),
        [onSelectionChange, options]
    );

    return (
        <MTable
            icons={TABLE_ICONS}
            isLoading={loading}
            options={tableOptions}
            onSelectionChange={onSelectionChange}
            columns={columns}
            title={title}
            {...rest}
        />
    );
}
