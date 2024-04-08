import "server-only"

type DrizzleWhere<T> = SQL<unknown> | ((aliases: T) => SQL<T> | undefined) | undefined

import { unstable_noStore as noStore } from "next/cache"


import { type GetTasksSchema } from "./validations"
import { Task } from "@/lib/store"
import { filterColumn } from "./filter-column"
import { tasks } from "./schema"

export async function getTasks({
  page,
  per_page,
  sort,
  title,
  status,
  priority,
  operator,
  from,
  to,
}: GetTasksSchema) {
  noStore()
  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (typeof sort === 'string' ? sort.split(".").filter(Boolean) : [
        "createdAt",
        "desc",
      ]) as [string, "asc" | "desc"];
            // Filter tasks by title
            const titleFilter = title
                ? filterColumn({
                        column: title,
                    value: title,
                        isSelectable: true,
                    })
                : undefined;

            // Filter tasks by status
            const statusFilter = status
                ? filterColumn({
                        column: tasks.status,
                        value: status,
                        isSelectable: true,
                    })
                : undefined;

            // Filter tasks by priority
            const priorityFilter = priority
                ? filterColumn({
                        column: tasks.priority,
                        value: priority,
                        isSelectable: true,
                    })
                : undefined;

            // Filter tasks by operator
            const operatorFilter = operator
                ? filterColumn({
                        column: tasks.operator,
                        value: operator,
                        isSelectable: true,
                    })
                : undefined;

            // Filter tasks by date range
            const dateRangeFilter = from && to
                ? filterDateRange({
                        column: tasks.createdAt,
                        from,
                        to,
                    })
                : undefined;

            // Get the tasks
            const tasks = {
                offset,
                limit: per_page,
                order: [[column, order]],
                where: {
                  title: titleFilter,
                  status: statusFilter,
                  priority: priorityFilter,
                  operator: operatorFilter,
                  createdAt: dateRangeFilter,
                },
            };

            return tasks;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }