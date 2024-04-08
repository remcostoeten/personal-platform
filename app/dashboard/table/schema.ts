
import { generateId } from "@/lib/utils"
export const databasePrefix = "shadcn"

export const statusEnum = pgEnum(`${databasePrefix}_status`, [
  "todo",
  "in-progress",
  "done",
  "canceled",
])

export const labelEnum = pgEnum(`${databasePrefix}_label`, [
  "bug",
  "feature",
  "enhancement",
  "documentation",
])

export const priorityEnum = pgEnum(`${databasePrefix}_priority`, [
  "low",
  "medium",
  "high",
])

const pgTable = (tableName: string, columns: Record<string, any>) => {
  return {
    $name: tableName,
    $columns: columns,
    $inferSelect: {} as any,
    $inferInsert: {} as any,
  }
}

function $defaultFn(defaultFn: () => any) {
  return { $defaultFn: defaultFn }
}



export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 30 })
    .notNull() // Call notNull here
    .$defaultFn(() => generateId()),
  // Add a comma here ^

  code: varchar("code", { length: 256 }),
  title: varchar("title", { length: 256 }),
  status: statusEnum("status").notNull().default("todo"),
  label: labelEnum("label").notNull().default("bug"),
  priority: priorityEnum("priority").notNull().default("low"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
function pgEnum(name: string, values: string[]) {
  const enumValues = values.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, {} as Record<string, string>);

  return (columnName: string) => {
    return {
      notNull: () => ({
        default: (defaultValue: string) => ({
          $placeholder$: defaultValue,
        }),
      }),
    };
  };
}
function timestamp(columnName: string) {
  return {
    defaultNow: () => ({
      notNull: () => ({
        $placeholder$: columnName,
      }),
    }),
  };
}

export function varchar(columnName: string, config: { length: number }) {
  return {
    notNull: () => ({
      default: (defaultValue: string) => ({
        $placeholder$: columnName,
      }),
      $defaultFn: (defaultFn: () => any) => ({ // Add this method
        $placeholder$: columnName,
        $defaultFn: defaultFn,
      }),
    }),
  };
}