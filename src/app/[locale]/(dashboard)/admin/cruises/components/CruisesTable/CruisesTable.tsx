"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import AddCruiseDialog from "./addCruiseDialog";
import { Button } from "@/components/ui/button";
import {
  handleDeleteById,
  updateCruiseStatus,
} from "@/lib/actions/cruise.action";
import toast from "react-hot-toast";
import { Link, useRouter } from "@/i18n/routing";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const columns: ColumnDef<TData, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      accessorKey: "view",
      header: `${t("cruisesTable.view")}`, // Add the "View" column header
      cell: ({ row }) => {
        const cruise = row.original; // Access the original row data
        const reservationId = cruise?.id; // Replace this with the actual ID you want to pass

        return (
          <Link href={`/reservation/${reservationId}`}>
            <Button className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-200">
              {t("cruisesTable.viewDetails")}
            </Button>
          </Link>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("cruisesTable.price")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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
            {cruise?.status === "pending" && (
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
            {cruise?.status === "active" && (
              <div className="flex justify-center gap-3">
                <span className="text-[green] font-bold">
                  {t("cruisesTable.active")}
                </span>
                <Button
                  onClick={() => handleStatusChange("reject")}
                  className="bg-[red]"
                >
                  {t("cruisesTable.reject")}
                </Button>{" "}
              </div>
            )}
            {cruise?.status === "reject" && (
              <div className="flex justify-center gap-3">
                <span className="text-[red] font-bold">
                  {t("cruisesTable.rejected")}
                </span>
                <Button
                  onClick={() => handleStatusChange("active")}
                  className="bg-[green]"
                >
                  {t("cruisesTable.activate")}
                </Button>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "edit",
      header: `${t("AttractionTable.edit")}`, // Add the "Edit" column header
      cell: ({ row }) => {
        const cruise = row.original; // Access the original row data

        return <AddCruiseDialog edit cruiseEditData={cruise} />;
      },
    },
    {
      accessorKey: "delete",
      header: `${t("cruisesTable.delete")}`,
      cell: ({ row }) => {
        const cruiseId = row.original.id;
        const handleDelete = async (id: string) => {
          try {
            await handleDeleteById(id); // Call your backend function to update the status
            toast.success(`Cruise Deleted Successfully`);
          } catch (error) {
            toast.error("Error Deleting the cruise");
          } finally {
            router.refresh();
          }
        };

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-[red] text-white p-2 rounded-md font-bold">
              {t("cruisesTable.dialogTriggerDelete")}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {" "}
                  {t("cruisesTable.dialogTriggerTitleDelete")}
                </DialogTitle>
                <DialogDescription>
                  {t("cruisesTable.dialogTriggerDescriptionDelete")}
                </DialogDescription>
              </DialogHeader>
              <Button
                className="bg-[red] text-white"
                onClick={() => {
                  handleDelete(cruiseId);
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
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <AddCruiseDialog admin />
      <div>
        <div className="flex items-center justify-start gap-2">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter names..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {t("cruisesTable.columns")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("cruisesTable.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("cruisesTable.next")}
          </Button>
        </div>
      </div>
    </>
  );
}

export default CruisesTable;
