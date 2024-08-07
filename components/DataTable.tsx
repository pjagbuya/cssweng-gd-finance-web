'use client';

import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  SquareArrowOutUpRight,
} from 'lucide-react';

type DataTableProps = {
  className?: string;
  clickableIdColumn?: boolean;
  columns: ColumnDef<unknown, any>[];
  data: any;
  deletable?: boolean;
  idFilter: string;
  idColumn: string;
  pkColumn: string;
  onRowDelete?: (id: string) => void;
  onRowEdit?: (id: string) => void;
  onRowSelect?: (id: string) => void;
};

type DeletePopupProps = {
  type: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

type SortableHeaderProps = {
  children: React.ReactNode;
  column: any;
};

// This should probably be somewhere else.
export function getFormattedDate(date: Date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
}

const DataTable = ({
  className,
  clickableIdColumn,
  columns,
  data,
  deletable,
  idColumn,
  idFilter,
  pkColumn,
  onRowEdit,
  onRowDelete,
  onRowSelect,
}: DataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const currentPageNum = table.getState().pagination.pageIndex + 1;

  useEffect(() => {
    table.getColumn(idColumn)?.setFilterValue(idFilter ?? '');
  }, [table, idColumn, idFilter]);

  return (
    <div className="flex flex-col">
      <Table className={className}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}

              {/* Extra to accommodate edit button */}
              <TableHead></TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => {
                  const body =
                    cell.column.id === idColumn && clickableIdColumn ? (
                      <Button
                        className="p-0 text-muted-foreground"
                        variant="ghost"
                        onClick={() => onRowSelect?.(data[row.id][pkColumn])}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}

                        <SquareArrowOutUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    );

                  return <TableCell key={cell.id}>{body}</TableCell>;
                })}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>...</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          if (onRowEdit) onRowEdit(data[row.id][pkColumn]);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>

                      {(deletable === undefined || deletable) && (
                        <DropdownMenuItem
                          onClick={() => {
                            if (onRowDelete)
                              onRowDelete(data[row.id][pkColumn]);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* +1 to accommodate edit button header */}
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* <div className="mt-2 flex items-center gap-2 self-end">
        <p className="-mb-0.5 mr-4 text-sm text-muted-foreground">
          Page {currentPageNum} of {table.getPageCount()}
        </p>

        <Button
          className="min-w-28 cursor-pointer"
          disabled={!table.getCanPreviousPage()}
          variant="outline"
          onClick={() => table.previousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          className="min-w-28 cursor-pointer"
          disabled={!table.getCanNextPage()}
          variant="outline"
          onClick={() => table.nextPage()}
        >
          <ChevronRight className="h-4 w-4" />
          Next
        </Button>
      </div> */}
    </div>
  );
};

const DeletePopup = ({ type, open, onCancel, onConfirm }: DeletePopupProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm {type} Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>

          {/* TODO: Emit a deletion event of sorts */}
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const SortableHeader = ({ children, column }: SortableHeaderProps) => {
  return (
    <Button
      className="p-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default DataTable;
export { DataTable, DeletePopup, SortableHeader };
