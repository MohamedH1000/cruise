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
    // Remove old associations for this attraction
    await prisma.attractionRestaurant.deleteMany({
      where: { attractionId: attractionId },
    });

    // Add new associations in the join table
    const restaurantConnections = restaurantIds.map((res) => ({
      attractionId: attractionId,
      restaurantId: res.value,
    }));

    await prisma.attractionRestaurant.createMany({
      data: restaurantConnections,
    });
  }

  if (restaurantIds.length === 0) {
    await prisma.attractionRestaurant.deleteMany({
      where: { attractionId: attractionId },
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
        restaurants: {
          select: {
            restaurant: true, // Only select restaurant data
          },
        },
      },
    });
    return attractions;
  } catch (error) {
    console.log(error);
  }
}

export async function getCombinedAttractionsByRestaurantArray() {
  try {
    // Fetch attractions with restaurant data
    const attractions = await prisma.attractions.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        restaurants: {
          include: {
            restaurant: true, // This ensures you get the actual restaurant data, not just the relation
          },
        },
      },
    });

    console.log("Fetched attractions:", attractions); // Debug log

    const restaurantArrayMap: any = {};

    attractions.forEach((attraction) => {
      // Sort and stringify restaurant IDs to form a unique key for each combination
      const restaurantIdsKey = attraction.restaurants
        .map((res) => res.restaurant.id)
        .sort() // Ensure consistent ordering
        .join(",");

      // Initialize the entry if it doesn't exist
      if (!restaurantArrayMap[restaurantIdsKey]) {
        restaurantArrayMap[restaurantIdsKey] = {
          restaurantNames: attraction.restaurants.map(
            (res) => res.restaurant.name
          ),
          attractionNames: [],
        };
      }

      // Add the attraction name to the grouped list
      restaurantArrayMap[restaurantIdsKey].attractionNames.push(
        attraction.name
      );
    });

    console.log("Grouped restaurantArrayMap:", restaurantArrayMap); // Debug log

    // Convert the map to an array with combined attraction names
    const combinedAttractions = Object.values(restaurantArrayMap).map(
      ({ restaurantNames, attractionNames }: any) => ({
        restaurants: restaurantNames.join(", "), // Combine restaurant names
        attractions: attractionNames.join(", "), // Combine attraction names
      })
    );

    console.log("Combined attractions:", combinedAttractions); // Final output log

    return combinedAttractions;
  } catch (error) {
    console.log("Error fetching combined attractions:", error);
    throw error;
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
