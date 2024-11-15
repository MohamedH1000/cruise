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
    location,
    amenities = [],
    delivery,
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
      delivery: parseInt(delivery, 10),
      amenities: [],
      location,
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
    location,
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
      location,
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
      where: {
        status: "active",
        // Assuming these fields are present in the cruise model:
        // adults: adults ? { gte: adults } : undefined,
        // kids: kids ? { gte: kids } : undefined,
        // rooms: rooms ? { gte: rooms } : undefined,
      },
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
export async function getAllCruisesBySearch(params: any) {
  const { page = 1, pageSize = 9, date, startDate, endDate } = params;
  const skipAmount = (page - 1) * pageSize;

  try {
    const cruises = await prisma.cruise.findMany({
      where: {
        status: "active",
        // Assuming these fields are present in the cruise model:
        // adults: adults ? { gte: adults } : undefined,
        // kids: kids ? { gte: kids } : undefined,
        // rooms: rooms ? { gte: rooms } : undefined,
        reservations: {
          none: {
            OR: [
              {
                startDate: {
                  lte: new Date(endDate), // Reservation starts before or on the end date
                },
                endDate: {
                  gte: new Date(startDate), // Reservation ends after or on the start date
                },
              },
            ],
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skipAmount,
      take: pageSize,
    });

    const totalAllowedCruises = await prisma.cruise.count({
      where: {
        status: "active",
        reservations: {
          none: {
            OR: [
              {
                startDate: {
                  lte: new Date(endDate),
                },
                endDate: {
                  gte: new Date(startDate),
                },
              },
            ],
          },
        },
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

export async function updateCruise(cruiseId: string, cruiseData: any) {
  const currentUser = await getCurrentUser();

  // Ensure the user is an admin
  if (currentUser?.role !== "admin") {
    throw new Error("You are not authorized to update this attraction");
  }

  const {
    name,
    description,
    imageSrc = [],
    numberOfGuests,
    discount,
    location,
    amenities = [],
    delivery,
    price,
  } = cruiseData;

  // Step 1: Update the attraction's basic information
  const updatedCruise = await prisma.cruise.update({
    where: {
      id: cruiseId,
    },
    data: {
      name,
      description,
      imageSrc: { set: imageSrc },
      numberOfGuests: parseInt(numberOfGuests),
      price: parseInt(price, 10),
      discount,
      delivery: parseInt(delivery, 10),
      amenities,
      location,
      userId: currentUser.id,
    },
  });

  // Step 3: Revalidate the page to show the updated attraction
  revalidatePath("/admin/cruises");

  return updatedCruise;
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
