"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data || [],
    columns: columns || [],
    getCoreRowModel: getCoreRowModel() || (() => ({})),
    getFilteredRowModel: getFilteredRowModel() || (() => ({})),
  });

  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <>
      <Input
        placeholder={`Search ${searchKey}...`}
        value={(table?.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table?.getColumn(searchKey)?.setFilterValue?.(event.target.value)
        }
        className="w-full md:max-w-sm"
      />
      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        <Table className="relative">
          <TableHeader>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup?.headers?.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                            header?.column?.columnDef?.header,
                            header?.getContext?.(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row?.getIsSelected?.() && "selected"}
                >
                  {row
                    ?.getVisibleCells?.()
                    ?.map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell?.column?.columnRenderer,
                          cell?.value,
                          cell?.row?.getData?.(),
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length}>No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table?.getFilteredSelectedRowModel()?.rows?.length} of{" "}
          {table?.getFilteredRowModel()?.rows?.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.previousPage?.()}
            disabled={!table?.getCanPreviousPage?.()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.nextPage?.()}
            disabled={!table?.getCanNextPage?.()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
