import { Checkbox } from "@/components/ui/checkbox";
import { StatusObject } from "@/statusData";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import OnlineIndicator from "@/components/effects/OnlineIndicator";

export const columns: ColumnDef<StatusObject>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "status",
    header: "status",
  },
  {
    accessorKey: "timestamp",
    header: "timestamp",
  },
  {
    accessorKey: "onlineOffline",
    header: "online/offline for",
    cell: ({ row }) => (
      <>
        <OnlineIndicator />
        {row.original.status === "Online" ? row.original.onlinefor : row.original.offlineSince}
      </>
    ),
  },
  {
    accessorKey: "ts",
    header: "last seen",
  },
  {
    accessorKey: "timesOnline",
    header: "times online",
  },
  {
    accessorKey: "firstSeen",
    header: "first seen",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];