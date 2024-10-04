"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";
import prisma from "@/lib/prisma";

export async function createAttraction(attractionData: any) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "admin") {
    throw new Error("You are not authorized to create the cruise");
  }
  const { name, description, imageSrc = [] } = attractionData;
  const cruise = await prisma.attractions.create({
    data: {
      name,
      description,
      imageSrc: { set: imageSrc },
    },
  });

  revalidatePath("/admin");

  return cruise;
}

export async function getAllAttractions() {
  try {
    const attractions = await prisma.attractions.findMany();
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
