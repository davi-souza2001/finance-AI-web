'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PaginationInfo } from '@/http/use-get-items'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { DialogContentExpense } from './components'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? -1,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <Dialog>
      <div className="w-full">
        <div className="flex w-full items-center justify-end gap-4 py-4">
          <DialogTrigger asChild>
            <Button className="cursor-pointer" variant="outline">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <Input
            className="max-w-sm"
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            placeholder="Filter name..."
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          />
        </div>

        <DialogContent>
          <DialogContentExpense />
        </DialogContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    key={row.id}
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
                    className="h-24 text-center"
                    colSpan={columns.length}
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            disabled={!pagination?.hasPreviousPage}
            onClick={() => {
              if (pagination?.currentPage && pagination.currentPage > 1) {
                onPageChange?.(pagination.currentPage - 1)
              }
            }}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          {pagination && (
            <span className="text-muted-foreground text-sm">
              Página {pagination.currentPage}
              {pagination.totalPages && ` de ${pagination.totalPages}`}
            </span>
          )}
          <Button
            disabled={!pagination?.hasNextPage}
            onClick={() => {
              if (pagination?.currentPage) {
                onPageChange?.(pagination.currentPage + 1)
              }
            }}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
