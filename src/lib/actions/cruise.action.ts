"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";
import prisma from "@/lib/prisma";

export async function createCruise(cruiseData: any) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "admin") {
    throw new Error("you are not authorized to create the chalet");
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

  revalidatePath("/admin/cruises");

  return cruise;
}

export async function getAllCruises() {
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
