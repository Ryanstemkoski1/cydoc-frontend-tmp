import { useMemo } from 'react';
import MTable, {
    Column,
    MaterialTableProps,
    Options,
} from '@material-table/core';
import SearchIcon from '@mui/icons-material/Search';

import { TABLE_ICONS } from '../Atoms/MaterialTableIcons';

import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import React from 'react';

export type ColumnSortInfo = { fieldName: string; direction: 'asc' | 'desc' };

interface Props<T extends object> extends MaterialTableProps<T> {
    loading?: boolean;
    onSelectionChange?: (items: T[]) => void;
    columnSortInfo?: ColumnSortInfo;
    tableId?: string;
}

type TableColumnData = {
    tableData: {
        // looks like columnId may be a number in later versions, but in x.x.35 it's a string
        id: number;
    };
};

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

interface FilterProps {
    columnDef: Column<any>;
    // looks like columnId may be a number in later versions, but in x.x.35 it's a string
    onFilterChanged: (columnId: number, value: any) => void;
}

const CustomFilterComponent = ({ columnDef, onFilterChanged }: FilterProps) => {
    return (
        <FormControl fullWidth variant='outlined'>
            <OutlinedInput
                size='small'
                sx={{
                    '& .MuiInputBase-input': {
                        padding: '4px 4px 4px 0px',
                    },
                    paddingLeft: '6px',
                }}
                onChange={(e) => {
                    const columnId = (
                        columnDef as Column<any> & TableColumnData
                    )?.tableData?.id;
                    // accept '0' index
                    if (columnId !== undefined && columnId !== null) {
                        onFilterChanged(
                            // looks like columnId may be a number in later versions, but in x.x.35 it's a string
                            columnId,
                            e.target.value
                        );
                    }
                }}
                startAdornment={
                    <InputAdornment
                        position='start'
                        sx={{ marginRight: '4px' }}
                    >
                        <SearchIcon fontSize='small' />
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};
