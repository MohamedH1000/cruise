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
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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

export function UsersTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations();

  const columns: ColumnDef<TData, any>[] = [
    {
      accessorKey: "name",
      header: t("cruisesTable.name"),
    },
    {
      accessorKey: "email",
      header: `${t("cruisesTable.email")}`,
    },
    {
      accessorKey: "phoneNumber",
      header: `${t("cruisesTable.phonenumber")}`,
    },
    {
      accessorKey: "createdAt",
      header: `${t("cruisesTable.createdAt")}`,
    },
    {
      accessorKey: "role",
      header: `${t("cruisesTable.role")}`,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
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

export default UsersTable;
