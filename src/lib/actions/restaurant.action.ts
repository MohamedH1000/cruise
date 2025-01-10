"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";
import prisma from "@/lib/prisma";

export async function createRestaurant(restaurantDetails: any) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "admin") {
    throw new Error("You are not authorized to create the cruise");
  }
  const { name, description, imageSrc = [], attractionId } = restaurantDetails;
  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      description,
      imageSrc: { set: imageSrc },
      attractionId,
    },
  });

  revalidatePath("/admin/restaurants");

  return restaurant;
}

export async function getAllRestaurantsTable() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return restaurants;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw new Error("Could not fetch restaurants");
  }
}

export const fetchRestaurantsByAttractions = async (
  selectedAttractions: string[]
) => {
  // console.log("attractions", attractions);
  if (!Array.isArray(selectedAttractions) || selectedAttractions.length === 0) {
    throw new Error("Invalid or empty attractions array");
  }

  try {
    // Clean the attraction names
    const attractionsName = selectedAttractions.map((name) => name.trim());

    // Log the attractions to ensure they are correct
    console.log("Selected Attractions:", attractionsName);

    // Fetch restaurants related to the attractions through the join table
    const restaurants = await prisma.restaurant.findMany({
      where: {
        attractions: {
          some: {
            attraction: {
              name: {
                in: attractionsName, // This queries the 'name' field on the Attraction model
              },
            },
          },
        },
      },
      include: {
        attractions: {
          include: {
            attraction: true, // Including the related attraction data
          },
        },
      },
    });

    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants by attractions:", error);
    if (error instanceof Error) {
      console.error(error.stack); // Log the stack trace for deeper insight
    }
    throw new Error("Failed to fetch restaurants");
  }
};

export const fetchRestaurantsByName = async (names: string[]) => {
  try {
    const attractions = await prisma.attractions.findMany({
      where: {
        name: {
          in: names, // Matches any attraction name in the provided array
        },
      },
      include: {
        restaurants: true, // Include the associated restaurants
      },
    });

    // Extract all restaurants from the attractions

    // Remove duplicates if the same restaurant is linked to multiple attractions
    return attractions;
  } catch (error) {
    console.error("Error fetching restaurants by attraction names:", error);
    throw new Error("Failed to fetch restaurants.");
  } finally {
    await prisma.$disconnect();
  }
};

export async function handleDeleteById(id: string) {
  try {
    await prisma.restaurant.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
