"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";
import prisma from "@/lib/prisma";

export async function createCruise(cruiseData: any) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "admin") {
    throw new Error("You are not authorized to create the cruise");
  }
  const {
    name,
    description,
    imageSrc = [],
    numberOfGuests,
    discount,
    amenities = [],
    price,
  } = cruiseData;
  const cruise = await prisma.cruise.create({
    data: {
      name,
      description,
      imageSrc: { set: imageSrc },
      numberOfGuests: parseInt(numberOfGuests),
      price: parseInt(price, 10),
      discount,
      amenities: [],
      userId: currentUser.id,
      status: "active",
    },
  });

  revalidatePath("/admin/cruises");

  return cruise;
}
export async function createCruiseByOwner(cruiseData: any) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "cruiseOwner") {
    throw new Error("You are not authorized to create the cruise");
  }
  const {
    name,
    description,
    imageSrc = [],
    numberOfGuests,
    discount,
    amenities = [],
    price,
  } = cruiseData;
  const cruise = await prisma.cruise.create({
    data: {
      name,
      description,
      imageSrc: { set: imageSrc },
      numberOfGuests: parseInt(numberOfGuests),
      price: parseInt(price, 10),
      discount,
      amenities: [],
      userId: currentUser.id,
      status: "pending",
    },
  });

  return cruise;
}

export async function getAllCruises(params: any) {
  const { page = 1, pageSize = 9 } = params;
  const skipAmount = (page - 1) * pageSize;

  try {
    const cruises = await prisma.cruise.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: skipAmount,
      take: pageSize,
    });
    const totalAllowedCruises = await prisma.cruise.count({
      where: {
        status: "active",
      },
    });
    const isNext = totalAllowedCruises > skipAmount + cruises.length;
    return { cruises, isNext, totalAllowedCruises };
  } catch (error) {
    console.log(error);
  }
}
export async function getAllCruisesTable() {
  try {
    const cruises = await prisma.cruise.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return cruises;
  } catch (error) {
    console.log(error);
  }
}

export async function getCruiseById(id: string) {
  try {
    const cruise = await prisma.cruise.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    return cruise;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCruiseStatus({ id, newStatus }: any) {
  // console.log("Updating cruise status for:", id, newStatus); // Debugging
  try {
    const updatedState = await prisma.cruise.update({
      where: {
        id,
      },
      data: {
        status: newStatus,
      },
    });

    return updatedState;
  } catch (error) {
    console.log(error);
  }
}

export async function handleDeleteById(id: string) {
  try {
    await prisma.cruise.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
