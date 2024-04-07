"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/constants/data";
import { CellAction } from "./CellAction";
import { StatusObject } from "@/statusData";

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
    header: "NAME",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "timestamp",
    header: "TIME",
  },
  {
    accessorKey: "onlinefor",
    header: "ONLINE FOR",
  },
  {
    accessorKey: "offlineSince",
    header: "OFFLINE SINCE",
  },
  {
    accessorKey: "lastSeen",
    header: "LAST SEEN",
  },
  {
    accessorKey: "timesOnline",
    header: "TIMES ONLINE",
  },
  {
    accessorKey: "firstSeen",
    header: "FIRST SEEN",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
