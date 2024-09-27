"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { useTranslations } from "next-intl";
import AddCruiseDialog from "./addCruiseDialog";

export type Payment = {
  id: string;
  name: string;
  description: string;
  amenities: Array<string>;
  numberOfGuests: number;
  price: number;
  discount: string;
  status: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export function CruisesTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations();

  const columns: ColumnDef<TData, any>[] = [
    {
      accessorKey: "name",
      header: t("cruisesTable.name"),
    },
    {
      accessorKey: "description",
      header: `${t("cruisesTable.description")}`,
    },
    {
      accessorKey: "amenities",
      header: `${t("cruisesTable.amenities")}`,
    },
    {
      accessorKey: "numberOfGuests",
      header: `${t("cruisesTable.numberOfGuests")}`,
    },
    {
      accessorKey: "price",
      header: `${t("cruisesTable.price")}`,
    },
    {
      accessorKey: "discount",
      header: `${t("cruisesTable.discount")}`,
    },
    {
      accessorKey: "status",
      header: `${t("cruisesTable.status")}`,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <AddCruiseDialog />
      <div className="rounded-[12px] border mt-3">
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
    </>
  );
}

export default CruisesTable;
