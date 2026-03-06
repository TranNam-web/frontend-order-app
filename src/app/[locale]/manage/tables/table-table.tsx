'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { getVietnameseTableStatus, handleErrorApi } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import { TableListResType } from '@/schemaValidations/table.schema'
import EditTable from '@/app/[locale]/manage/tables/edit-table'
import AddTable from '@/app/[locale]/manage/tables/add-table'
import { useDeleteTableMutation, useTableListQuery } from '@/queries/useTable'
import QRCodeTable from '@/components/qrcode-table'
import { toast } from '@/components/ui/use-toast'

/* ICONS UI */
import { Pencil, Trash2, Users, Table2, QrCode } from 'lucide-react'

type TableItem = TableListResType['data'][0]

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void
  tableIdEdit: number | undefined
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}>({
  setTableIdEdit: () => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: () => {}
})

/* ===========================
   COLUMNS
=========================== */

export const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: 'number',
    header: () => (
      <div className='flex items-center gap-2'>
        <Table2 size={16} />
        Số bàn
      </div>
    ),
    cell: ({ row }) => (
      <div className='font-semibold text-primary'>
        Bàn {row.getValue('number')}
      </div>
    ),
    filterFn: (rows, columnId, filterValue) => {
      if (!filterValue) return true
      return String(filterValue) === String(rows.getValue('number'))
    }
  },
  {
    accessorKey: 'capacity',
    header: () => (
      <div className='flex items-center gap-2'>
        <Users size={16} />
        Sức chứa
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Users size={14} />
        {row.getValue('capacity')} người
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: () => (
      <div className='flex items-center gap-2'>
        📊 Trạng thái
      </div>
    ),
    cell: ({ row }) => (
      <span className='px-2 py-1 text-xs rounded-md bg-muted'>
        {getVietnameseTableStatus(row.getValue('status'))}
      </span>
    )
  },
  {
    accessorKey: 'token',
    header: () => (
      <div className='flex items-center gap-2'>
        <QrCode size={16} />
        QR Code
      </div>
    ),
    cell: ({ row }) => (
      <QRCodeTable
        token={row.getValue('token')}
        tableNumber={row.getValue('number')}
      />
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = useContext(TableTableContext)

      const openEditTable = () => {
        setTableIdEdit(row.original.number)
      }

      const openDeleteTable = () => {
        setTableDelete(row.original)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={openEditTable} className='gap-2'>
              <Pencil size={14} />
              Sửa
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={openDeleteTable}
              className='gap-2 text-red-500 focus:text-red-500'
            >
              <Trash2 size={14} />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

/* ===========================
   DELETE DIALOG
=========================== */

function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete
}: {
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}) {
  const { mutateAsync } = useDeleteTableMutation()

  const deleteTable = async () => {
    if (tableDelete) {
      try {
        const result = await mutateAsync(tableDelete.number)

        setTableDelete(null)

        toast({
          title: result.payload.message
        })
      } catch (error) {
        handleErrorApi({ error })
      }
    }
  }

  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) setTableDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {tableDelete?.number}
            </span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTable}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/* ===========================
   MAIN TABLE
=========================== */

const PAGE_SIZE = 10

export default function TableTable() {
  const searchParam = useSearchParams()

  const page = searchParam.get('page')
    ? Number(searchParam.get('page'))
    : 1

  const pageIndex = page - 1

  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>()
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null)

  const tableListQuery = useTableListQuery()

  const data = tableListQuery.data?.payload.data ?? []

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <TableTableContext.Provider
      value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
    >
      <div className='w-full'>

        <EditTable id={tableIdEdit} setId={setTableIdEdit} />

        <AlertDialogDeleteTable
          tableDelete={tableDelete}
          setTableDelete={setTableDelete}
        />

        <div className='flex items-center py-4'>
          <Input
            placeholder='🔍 Lọc số bàn...'
            value={
              (table.getColumn('number')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('number')
                ?.setFilterValue(event.target.value)
            }
            className='max-w-sm shadow-sm'
          />

          <div className='ml-auto flex items-center gap-3'>
            <AddTable />
          </div>
        </div>

        <div className='rounded-xl border shadow-sm overflow-hidden'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className='hover:bg-muted/50 transition-colors'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-sm text-muted-foreground py-4 flex-1'>
            Hiển thị{' '}
            <strong>{table.getPaginationRowModel().rows.length}</strong>{' '}
            trong <strong>{data.length}</strong> kết quả
          </div>

          <AutoPagination
            page={table.getState().pagination.pageIndex + 1}
            pageSize={table.getPageCount()}
            pathname='/manage/tables'
          />
        </div>
      </div>
    </TableTableContext.Provider>
  )
}