"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
} from "react";
import useWriteParams from "@/hooks/use-write-params";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  //pagination
  searchKey?: string;
  canNext?: boolean;
  nextHandler?: () => void;
  canPrevious?: boolean;
  previousHandler?: () => void;

  //search
  ssrSearchKey?: string;
}

export interface SSRSearchProps {
  searchKey: string;
}

const SSRSearch = memo(({ searchKey }: SSRSearchProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, current, handler] = useWriteParams(searchKey, 750);
  const [value, setValue] = useState<string>(current);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();
      setValue(e.target.value);
      handler(e);
    },
    [handler]
  );

  useEffect(() => {
    if (ref.current && value) ref.current.focus();
  }, [value]);

  return (
    <div className="flex gap-2 items-center py-4">
      <Input
        placeholder="Search..."
        onChange={onChangeHandler}
        className={"max-w-sm"}
        value={value}
        ref={ref}
        disabled={pending}
        aria-disabled={pending}
      />
    </div>
  );
});
SSRSearch.displayName = "SSRSearch";

function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  canNext,
  nextHandler,
  canPrevious,
  previousHandler,
  ssrSearchKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      {ssrSearchKey && (
        <Suspense>
          <SSRSearch searchKey={ssrSearchKey} />
        </Suspense>
      )}
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  className="h-24 text-center"
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
          variant="outline"
          size="sm"
          onClick={() =>
            typeof previousHandler === "function"
              ? previousHandler()
              : table.previousPage()
          }
          disabled={
            typeof canPrevious === "boolean"
              ? !canPrevious
              : !table.getCanPreviousPage()
          }
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            typeof nextHandler === "function" ? nextHandler() : table.nextPage()
          }
          disabled={
            typeof canNext === "boolean" ? canNext : !table.getCanNextPage()
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default memo(DataTable);
