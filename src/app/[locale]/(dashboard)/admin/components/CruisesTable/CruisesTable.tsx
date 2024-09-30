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
import { Button } from "@/components/ui/button";
import { updateCruiseStatus } from "@/lib/actions/cruise.action";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import { id } from "date-fns/locale";

export type Payment = {
  id: string;
  name: string;
  description: string;
  amenities: Array<string>;
  numberOfGuests: number;
  price: number;
  discount: string;
  status: "pending" | "active" | "reject";
};

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export function CruisesTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
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
      cell: ({ row }) => {
        const cruise = row.original; // Access the original row data

        const handleStatusChange = async (newStatus: string) => {
          try {
            await updateCruiseStatus({ id: cruise?.id, newStatus }); // Call your backend function to update the status
            toast.success(`Status changed to ${newStatus}`);
          } catch (error) {
            toast.error("Error changing status");
          } finally {
            router.refresh();
          }
        };

        return (
          <div className="flex space-x-2">
            {cruise.status === "pending" && (
              <>
                <div className="flex justify-center gap-3">
                  <span className="text-[gray] font-bold">
                    {t("cruisesTable.pending")}
                  </span>
                  <div className="flex flex-col items-center gap-2">
                    <Button onClick={() => handleStatusChange("active")}>
                      {t("cruisesTable.activate")}
                    </Button>
                    <Button onClick={() => handleStatusChange("reject")}>
                      {t("cruisesTable.reject")}
                    </Button>
                  </div>
                </div>
              </>
            )}
            {cruise.status === "active" && (
              <div className="flex justify-center gap-3">
                <span className="text-[green] font-bold">
                  {t("cruisesTable.active")}
                </span>
                <Button onClick={() => handleStatusChange("reject")}>
                  {t("cruisesTable.reject")}
                </Button>{" "}
              </div>
            )}
            {cruise.status === "reject" && (
              <div className="flex justify-center gap-3">
                <span className="text-[red] font-bold">
                  {t("cruisesTable.rejected")}
                </span>
                <Button onClick={() => handleStatusChange("active")}>
                  {t("cruisesTable.activate")}
                </Button>
              </div>
            )}
          </div>
        );
      },
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
