"use client"

import * as React from "react"


import { filterFields, getColumns } from "./tasks-table-columns"
import { TasksTableFloatingBar } from "./tasks-table-floating-bar"
import { useTasksTable } from "./tasks-table-provider"
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions"
import { DataTable } from "@/components/ui/data-table"
import { getTasks } from "../queries"
import { DataTableAdvancedToolbar } from "./advanced/data-table-advanced-toolbar"
import { DataTableToolbar } from "./data-table-toolbar"

interface TasksTableProps {
  tasksPromise: ReturnType<typeof getTasks>
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
  // Flags for showcasing some additional features. Feel free to remove them.
  const { enableAdvancedFilter, showFloatingBar } = useTasksTable()

  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data, pageCount } = React.use(tasksPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])




  const table = () => DataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter,
  })

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {enableAdvancedFilter ? (
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <TasksTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table} filterFields={filterFields}>
          <TasksTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
      <DataTable
        table={table}
        columns={columns}
        floatingBar={
          showFloatingBar ? <TasksTableFloatingBar table={table} /> : null
        }
      />
    </div>
  )
}
