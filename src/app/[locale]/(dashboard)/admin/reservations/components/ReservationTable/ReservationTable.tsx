"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
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
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleDeleteById } from "@/lib/actions/attraction.action";
import toast from "react-hot-toast";

export type Reservation = {
  id: string;
  userId: string | null;
  user: { name: string } | null;
  cruise: { name: string };
  startDate: string;
  endDate: string;
  totalPrice: number;
  phoneNumber: string | null;
  createdAt: string;
  status: string;
};

interface ReservationTableProps {
  data: Reservation[];
}

export function ReservationTable({ data }: ReservationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MM/dd/yyyy");

  const columns: ColumnDef<Reservation, any>[] = [
    {
      accessorKey: "arrangementId",
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "id",
      header: "Reservation ID",
    },
    {
      accessorKey: "user.name",
      header: `${t("translations.username")}`,
      cell: ({ row }) => row.original.user?.name || "N/A",
    },
    {
      accessorKey: "cruise.name",
      header: `${t("translations.cruisename")}`,
      cell: ({ row }) => row.original.cruise.name,
    },
    {
      accessorKey: "startDate",
      header: `${t("translations.startdate")}`,
      cell: ({ row }) => formatDate(row.original.startDate),
    },
    {
      accessorKey: "endDate",
      header: `${t("translations.enddate")}`,
      cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
      accessorKey: "totalPrice",
      header: `${t("translations.totalPrice")}`,
    },
    {
      accessorKey: "currency",
      header: `${t("translations.totalPrice")}`,
    },
    {
      accessorKey: "phoneNumber",
      header: `${t("translations.phonenumber")}`,
    },
    {
      accessorKey: "createdAt",
      header: `${t("translations.createdAt")}`,
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "status",
      header: `${t("translations.status")}`,
      cell: ({ row }) => {
        const status = row.original.status;
        let statusColor = "text-gray-500";

        if (status === "active") statusColor = "text-green-500";
        if (status === "failed") statusColor = "text-red-500";
        if (status === "pending") statusColor = "text-gray-500";

        return <span className={`font-bold ${statusColor}`}>{status}</span>;
      },
    },
    {
      accessorKey: "delete",
      header: `${t("translations.deleteReservation")}`,
      cell: ({ row }) => {
        const reservationId = row.original.id;
        const handleDelete = async (id: string) => {
          try {
            const response = await fetch("/api/reservation", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ reservId: id }),
            });

            if (response.ok) {
              toast.success(`${t("translations.resDelSuccess")}`);
              router.refresh(); // Refresh data if the deletion was successful
            } else {
              toast.error(`${t("translations.resDelError")}`);
              console.error("Failed to delete reservation");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        };

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-[red] text-white p-2 rounded-md font-bold">
              {t("cruisesTable.dialogTriggerDelete")}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> {t("translations.resDelTitle")}</DialogTitle>
                <DialogDescription>
                  {t("translations.resDelDescription")}
                </DialogDescription>
              </DialogHeader>
              <Button
                className="bg-[red] text-white"
                onClick={() => {
                  handleDelete(reservationId);
                  setOpen(false);
                }}
              >
                {t("cruisesTable.dialogTriggerDelete")}
              </Button>
              <Button onClick={() => setOpen(false)}>
                {t("cruisesTable.cancel")}
              </Button>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-lg border mt-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No reservations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end space-x-2 py-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t("cruisesTable.previous")}
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t("cruisesTable.next")}
        </Button>
      </div>
    </div>
  );
}

export default ReservationTable;
