"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";
import prisma from "@/lib/prisma";

export async function createAttraction(attractionData: any) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "admin") {
    throw new Error("You are not authorized to create the cruise");
  }
  const { name, description, imageSrc = [], restaurantIds } = attractionData;
  const attraction = await prisma.attractions.create({
    data: {
      name,
      description,
      imageSrc: { set: imageSrc },
    },
  });

  if (restaurantIds.length > 0) {
    await prisma.restaurant.updateMany({
      where: { id: { in: restaurantIds?.map((res) => res.value) } },
      data: { attractionId: attraction.id },
    });
  }

  revalidatePath("/admin");

  return attraction;
}

export async function updateAttraction(
  attractionId: string,
  attractionData: any
) {
  const currentUser = await getCurrentUser();

  // Ensure the user is an admin
  if (currentUser?.role !== "admin") {
    throw new Error("You are not authorized to update this attraction");
  }

  const { name, description, imageSrc = [], restaurantIds } = attractionData;

  // Step 1: Update the attraction's basic information
  const updatedAttraction = await prisma.attractions.update({
    where: {
      id: attractionId,
    },
    data: {
      name,
      description,
      imageSrc: { set: imageSrc }, // Update imageSrc if changed
    },
  });

  // Step 2: Update the restaurant associations if restaurantIds are provided
  if (restaurantIds?.length > 0) {
    // Clear previous relationships by setting `attractionId` to null for current associated restaurants
    await prisma.restaurant.updateMany({
      where: { attractionId: attractionId },
      data: { attractionId: null },
    });

    // Update the restaurants with the new attractionId
    await prisma.restaurant.updateMany({
      where: { id: { in: restaurantIds.map((res) => res.value) } },
      data: { attractionId: attractionId },
    });
  }

  // Step 3: Revalidate the page to show the updated attraction
  revalidatePath("/admin");

  return updatedAttraction;
}

export async function getAllAttractions(params: any) {
  const { page = 1, pageSize = 9 } = params;
  const skipAmount = (page - 1) * pageSize;
  try {
    const attractions = await prisma.attractions.findMany({
      skip: skipAmount,
      take: pageSize,
    });
    const totalAttractions = await prisma.attractions.count();
    const isNext = totalAttractions > skipAmount + attractions.length;
    return { attractions, isNext, totalAttractions };
  } catch (error) {
    console.log(error);
  }
}
export async function getAllAttractionsTable() {
  try {
    const attractions = await prisma.attractions.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        restaurants: true,
      },
    });
    return attractions;
  } catch (error) {
    console.log(error);
  }
}

export async function getAttractionById(id: string) {
  try {
    const attraction = await prisma.attractions.findUnique({
      where: {
        id,
      },
    });

    return attraction;
  } catch (error) {
    console.log(error);
  }
}

export async function handleDeleteById(id: string) {
  try {
    await prisma.attractions.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
