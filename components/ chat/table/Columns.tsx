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
        {row.original.status === "Online"
          ? row.original.onlinefor
          : row.original.offlineSince}
      </>
    ),
  },
  {
    // On boot up show this, then update to last seen when the user goes offline
    accessorKey: "firstTimestamp",
    header: "First timestamp",

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
  {
    id: "indicator",
    cell: ({ row }) => (
      <OnlineIndicator
        size={4}
        color="emerald"
        style={{
          backgroundColor: row.original.status === "Online" ? "green" : "red",
        }}
      />
    ),
  },
];
