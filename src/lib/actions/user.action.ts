"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function createUser(userData: any) {
  try {
    const { email, name, password, phoneNumber, accountRole: role } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phoneNumber,
        role,
        hashedPassword,
      },
    });

    return user;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function editUser(personalData: any) {
  const currentUser = await getCurrentUser();
  const id = currentUser?.id;
  try {
    const {
      name,
      email,
      phoneNumber,
      image,
      accountRole,
      password,
      repeatPassword,
    } = personalData;
    if (password !== repeatPassword && password) {
      return Error("password and repeat password fields should match");
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    } else {
      hashedPassword = currentUser?.hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
        image,
        role: accountRole,
        hashedPassword,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function editAnyUserRole({ id, role }: any) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        role,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return users;
  } catch (error) {
    console.log(error);
  }
}
export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (error: any) {
    return null;
  }
}

export async function deleteUserById(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
  }
}
