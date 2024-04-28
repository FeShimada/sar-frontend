"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, MuiEvent, gridClasses } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useRouter } from 'next/navigation';


interface DataTablePropType {
    articles: any[]
    handleRowClick?: () => void
    setSelectedArticle?: React.Dispatch<React.SetStateAction<{
      id: number;
  }>>
}

interface UnsortedIconProps {
  className: string;
}

export function UnsortedIcon({ className }: UnsortedIconProps) {
  return <SwapVertIcon className={className} />;
}

export default function DataTable(props: DataTablePropType) {

    const columns: GridColDef<(typeof props.articles)[number]>[] = [
        {
          field: 'title',
          headerName: 'Título', width: 150
        },
        {
          field: 'status',
          headerName: 'Situação', width: 150
        },
        {
          field: 'score1',
          headerName: 'Pontuação 1', width: 150
        },
        {
          field: 'score2',
          headerName: 'Pontuação 2',
          width: 150
        },
        {
          field: 'media',
          headerName: 'Média',
          flex: 1,
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
    if(props.handleRowClick) {
      props.setSelectedArticle!(params);
      props.handleRowClick();
      return;
    }
    router.push(`/dashboard/measurer/${params.id}`);
  }

  return (
    <Box sx={{ height: '500px', width: '100%' }}>
      <DataGrid
        rows={props.articles}
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