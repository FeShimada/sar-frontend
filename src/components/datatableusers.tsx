"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, MuiEvent, gridClasses } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useRouter } from 'next/navigation';


interface DataTablePropType {
    users: any[]
    handleRowClick?: () => void
    setSelectedUser?: React.Dispatch<React.SetStateAction<{
        id: number;
    }>>
}

interface UnsortedIconProps {
    className: string;
}

export function UnsortedIcon({ className }: UnsortedIconProps) {
    return <SwapVertIcon className={className} />;
}

export default function DataTableUsers(props: DataTablePropType) {

    const columns: GridColDef<(typeof props.users)[number]>[] = [
        {
            field: 'name',
            headerName: 'Nome', width: 150
        },
        {
            field: 'role',
            headerName: 'Cargo', width: 150,
            valueGetter: (params) => {
                switch (params) {
                    case 0:
                        return 'Autor';
                    case 1:
                        return 'Avalidor';
                    case 2:
                        return 'Administrador';
                    default:
                        return '';
                }
            }
        },
        {
            field: 'email',
            headerName: 'Email', flex: 1
        },
        {
            field: '',
            sortable: false,
            renderCell: (params) => [
                <VisibilityOutlinedIcon
                    key={params.row.id}
                    className="hovered-icon"
                    sx={{
                        color: '#CED4DA',
                        outline: 'none',
                        '&:hover': {
                            color: '#6c757d'
                        },

                    }}
                />
            ],
        }
    ];

    const router = useRouter()

    const handleRowClick = (params: any, event: MuiEvent<React.MouseEvent<HTMLElement, MouseEvent>>) => {
        if (props.handleRowClick) {
            props.setSelectedUser!(params);
            props.handleRowClick();
            return;
        }
        router.push(`/dashboard/measurer/${params.id}`);
    }

    return (
        <Box sx={{ height: '500px', width: '100%' }}>
            <DataGrid
                rows={props.users}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 100,
                        },
                    },
                }}
                pageSizeOptions={[100]}
                disableRowSelectionOnClick
                onRowClick={(params, event) => handleRowClick(params, event)}
                disableColumnMenu
                getRowId={(row) => row.id}
                rowHeight={41}
                slots={{
                    columnUnsortedIcon: UnsortedIcon,
                }}
                sx={{
                    [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: { outline: 'none' },
                    [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: { outline: 'none' },
                    '& .MuiDataGrid-row:hover': {
                        '& .hovered-icon': {
                            color: '#6c757d',
                        },
                    }
                }}
            />
        </Box>
    );
}