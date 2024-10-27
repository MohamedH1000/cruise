"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import AddAttractionDialog from "./components/addAttractionDialog";
import { handleDeleteById } from "@/lib/actions/attraction.action";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export function AttractionsTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
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
      header: t("cruisesTable.description"),
    },
    {
      accessorKey: "restaurants",
      header: t("cruisesTable.restaurants"),
      cell: ({ row }) => {
        const restaurants = row.original.restaurants;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="link" className="text-blue-500">
                {restaurants.length > 0
                  ? `${restaurants.length} ${t("translations.restaurants")}`
                  : t("translations.noRestaurant")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2 space-y-1">
                {restaurants.length > 0 ? (
                  <ol className="list-decimal pl-4">
                    {" "}
                    {/* list-decimal gives numbered list, pl-4 adds padding to indent */}
                    {restaurants.map(
                      (restaurant: { name: string }, index: number) => (
                        <li key={restaurant.name} className="mb-1 font-bold">
                          {" "}
                          {/* mb-1 adds margin between items */}
                          {restaurant.name}
                        </li>
                      )
                    )}
                  </ol>
                ) : (
                  <span>No restaurants</span>
                )}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "edit",
      header: `${t("AttractionTable.edit")}`, // Add the "Edit" column header
      cell: ({ row }) => {
        const attraction = row.original; // Access the original row data

        return <AddAttractionDialog edit attractionEditData={attraction} />;
      },
    },
    {
      accessorKey: "delete",
      header: `${t("AttractionTable.delete")}`,
      cell: ({ row }) => {
        const attraction = row.original; // Access the original row data

        const handleDelete = async (id: string) => {
          try {
            await handleDeleteById(id); // Call your backend function to update the status
            toast.success(`Attraction Deleted Successfully`);
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
                  {t("AttractionTable.dialogTriggerTitleDelete")}
                </DialogTitle>
                <DialogDescription>
                  {t("AttractionTable.dialogTriggerDescriptionDelete")}
                </DialogDescription>
              </DialogHeader>
              <Button
                className="bg-[red] text-white"
                onClick={() => {
                  handleDelete(attraction?.id);
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
      <AddAttractionDialog admin />
      <div>
        <div className="flex justify-start items-center gap-2">
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
          {table?.getFilteredSelectedRowModel()?.rows?.length} of{" "}
          {table?.getFilteredRowModel()?.rows?.length} row(s) selected.
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
              {table?.getRowModel()?.rows?.length ? (
                table?.getRowModel()?.rows?.map((row) => (
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

export default AttractionsTable;
