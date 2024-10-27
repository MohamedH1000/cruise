"use client";
import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  VisibilityState,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteUserById, editAnyUserRole } from "@/lib/actions/user.action";
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
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);
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
      cell: ({ row }) => {
        const user = row.original;
        const handleChangeRole = async ({ id, value }: any) => {
          try {
            await editAnyUserRole({ id, role: value });
            toast.success("تم تعديل صلاحية المستخدم بنجاح");
          } catch (error) {
            toast.success("حصل خطا اثناء التعديل");
          } finally {
            router.refresh();
          }
        };
        return (
          <Select
            value={row.getValue("role")}
            onValueChange={(value) => handleChangeRole({ id: user?.id, value })}
            disabled={user?.email === "mohammedhisham115@gmail.com"}
          >
            <SelectTrigger className="w-full rounded-[12px]">
              <SelectValue
                placeholder={`${t("SignUp.accountRole")}`}
                className="placeholder:opacity-30"
              />
            </SelectTrigger>
            <SelectContent className="bg-white cursor-pointer rounded-[12px] z-30">
              <SelectItem value="admin" className="cursor-pointer">
                {t("chooseAccountType.admin")}
              </SelectItem>
              <SelectItem value="client" className="cursor-pointer">
                {t("chooseAccountType.client")}
              </SelectItem>
              <SelectItem value="cruiseOwner" className="cursor-pointer">
                {t("chooseAccountType.cruiseOwner")}
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "state",
      header: `${t("cruisesTable.status")}`,
    },
    {
      accessorKey: "deleteAccount",
      header: `${t("cruisesTable.deleteAccount")}`,
      cell: ({ row }) => {
        const user = row.original; // Access the original row data
        const disabled =
          user?.email === "mohammedhisham115@gmail.com" ||
          user?.role === "admin";
        const handleDelete = async (id: string) => {
          try {
            await deleteUserById(id); // Call your backend function to update the status
            toast.success(`User Deleted Successfully`);
          } catch (error) {
            toast.error("Error Deleting the User");
          } finally {
            router.refresh();
          }
        };

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              className={cn("bg-[red] text-white p-2 rounded-md font-bold", {
                "bg-red-400": disabled,
              })}
              disabled={disabled}
            >
              {t("cruisesTable.dialogTriggerDelete")}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {" "}
                  {t("translations.dialogTriggerUserTitleDelete")}
                </DialogTitle>
                <DialogDescription>
                  {t("translations.dialogTriggerUserDescriptionDelete")}
                </DialogDescription>
              </DialogHeader>
              <Button
                className="bg-[red] text-white"
                onClick={() => {
                  handleDelete(user?.id);
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

          <div className="flex items-center py-4">
            <Input
              placeholder="Filter Emails..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter Phone Number..."
              value={
                (table.getColumn("phoneNumber")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("phoneNumber")
                  ?.setFilterValue(event.target.value)
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
                        {header?.isPlaceholder
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

export default UsersTable;
