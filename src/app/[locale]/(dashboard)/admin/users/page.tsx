import React from "react";
import UsersTable, { Payment } from "./UsersTable";
import { getAllUsers } from "@/lib/actions/user.action";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    // ...
  ];
}
const Users = async () => {
  // const data = getData();
  const users = await getAllUsers();

  return (
    <div className="mt-[100px]">
      <h1 className="font-bold text-3xl">حسابات المستخدمين</h1>
      <UsersTable data={users} />
    </div>
  );
};

export default Users;
