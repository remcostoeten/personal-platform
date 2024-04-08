"use client"

import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTableFilterField } from "../types"
import { classNames } from "uploadthing/client"


interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table && typeof table.getState === 'function' ? table.getState().columnFilters.length > 0 : false;
  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    }
  }, [filterFields])

  return (
    <div
      className={classNames(
        "flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 space-x-2 overflow-auto p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map((column) => {
            if (table && typeof table.getColumn === 'function') {
              const tableColumn = table.getColumn(column.value ? String(column.value) : "");
              if (tableColumn) {
                return (
                  <Input
                    key={String(column.value)}
                    placeholder={column.placeholder}
                    value={(tableColumn.getFilterValue() as string) ?? ""}
                    onChange={(event) => tableColumn.setFilterValue(event.target.value)}
                    className="h-8 w-40 lg:w-64"
                  />
                );
              }
            }
            return null;
          })}
      </div>
    </div>
  );
}
