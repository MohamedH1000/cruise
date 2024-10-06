import React from "react";
import UsersTable, { Payment } from "./UsersTable";
import { getAllUsers } from "@/lib/actions/user.action";

const Users = async () => {
  const users = await getAllUsers();

  return (
    <div className="mt-[100px]">
      <h1 className="font-bold text-3xl">حسابات المستخدمين</h1>
      <UsersTable data={users} />
    </div>
  );
};

export default Users;
