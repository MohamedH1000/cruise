"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";
import prisma from "@/lib/prisma";

export async function createRestaurant(restaurantDetails: any) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "admin") {
    throw new Error("You are not authorized to create the cruise");
  }
  const { name, description, imageSrc = [] } = restaurantDetails;
  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      description,
      imageSrc: { set: imageSrc },
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
  try {
    // Clean the attraction names
    const attractions = selectedAttractions.map((name) => name.trim());
    // console.log("attractions", attractions);

    // Log the attractions to ensure they are correct
    // console.log("Selected Attractions:", attractions);

    // Fetch restaurants related to the attractions through the join table
    const restaurants = await prisma.restaurant.findMany({
      where: {
        attractions: {
          some: {
            attraction: {
              name: {
                in: attractions, // This queries the 'name' field on the Attraction model
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
