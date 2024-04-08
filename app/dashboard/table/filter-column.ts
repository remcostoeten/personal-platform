import { DataTableConfig } from "./data-table";

// Define your own comparison functions
const eq = (a, b) => a === b;
const ilike = (a, b) => a.toLowerCase().includes(b.toLowerCase());
const inArray = (a, arr) => arr.includes(a);
const isNotNull = (a) => a !== null;
const isNull = (a) => a === null;
const not = (a) => !a;
const notLike = (a, b) => !a.includes(b);

// Define your own types
type Column = any; // replace 'any' with your actual type
type ColumnBaseConfig = any; // replace 'any' with your actual type
type ColumnDataType = any; // replace 'any' with your actual type


export function filterColumn({
  column,
  value,
  isSelectable,
}: {
  column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>
  value: string
  isSelectable?: boolean
}) {
  const [filterValue, filterOperator] = (value?.split("~").filter(Boolean) ??
    []) as [
    string,
    DataTableConfig["comparisonOperators"][number]["value"] | undefined,
  ]

  if (!filterValue) return

  if (isSelectable) {
    switch (filterOperator) {
      case "eq":
        return inArray(column, filterValue?.split(".").filter(Boolean) ?? [])
      case "notEq":
        return not(
          inArray(column, filterValue?.split(".").filter(Boolean) ?? [])
        )
      case "isNull":
        return isNull(column)
      case "isNotNull":
        return isNotNull(column)
      default:
        return inArray(column, filterValue?.split(".") ?? [])
    }
  }

  switch (filterOperator) {
    case "ilike":
      return ilike(column, `%${filterValue}%`)
    case "notIlike":
      return notLike(column, `%${filterValue}%`)
    case "startsWith":
      return ilike(column, `${filterValue}%`)
    case "endsWith":
      return ilike(column, `%${filterValue}`)
    case "eq":
      return eq(column, filterValue)
    case "notEq":
      return not(eq(column, filterValue))
    case "isNull":
      return isNull(column)
    case "isNotNull":
      return isNotNull(column)
    default:
      return ilike(column, `%${filterValue}%`)
  }
}
