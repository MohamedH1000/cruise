"use server";
import { redirect } from "@/i18n/routing";
import prisma from "@/lib/prisma"; // Adjust the path to your Prisma client
import { getCurrentUser } from "./user.action";
import { revalidatePath } from "next/cache";

export async function getAllReservations() {
  try {
    const reservations = await prisma?.reservation.findMany();
    return reservations;
  } catch (error) {
    console.log(error);
  }
}

export async function getReservationsByUserId(userId: string) {
  // Fetch the current user to check their role
  const currentUser = await getCurrentUser();

  // Redirect if the user ID is not provided or user is not authenticated
  if (!userId || !currentUser) {
    redirect("/");
  }

  try {
    let reservations;

    if (currentUser?.role === "admin") {
      // If the user is an admin, fetch all reservations
      reservations = await prisma.reservation.findMany({
        select: {
          startDate: true,
          endDate: true,
          totalPrice: true,
          currency: true, // Include the currency field
          userId: true, // Include userId for context if needed
        },
      });
    } else {
      // For regular users, fetch reservations related to the given user ID
      reservations = await prisma.reservation.findMany({
        where: { userId },
        select: {
          startDate: true,
          endDate: true,
          currency: true, // Include the currency field
          totalPrice: true,
        },
      });
    }

    if (reservations.length === 0) {
      return { totalDays: 0, totalPrice: 0, reservations: [] };
    }

    // Initialize totals
    let totalDays = 0;
    let totalPrice = 0;

    // Calculate total days and total price
    reservations.forEach((reservation) => {
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);

      // Add +1 night to the reservation
      endDate.setDate(endDate.getDate() + 1);

      // Calculate days
      const days =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      totalDays += days;

      // Ensure totalPrice is treated as a number
      const price = parseFloat(reservation.totalPrice);
      if (!isNaN(price)) {
        totalPrice += price;
      } else {
        console.warn(
          `Invalid price value detected in reservation: ${reservation.totalPrice}`
        );
      }
    });

    return { totalDays, totalPrice, reservations };
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Error fetching reservations");
  }
}
export async function getReservationsByCruiseId(cruiseId: string) {
  // Fetch the current user to check their role
  const currentUser = await getCurrentUser();

  try {
    let reservations;

    if (currentUser?.role === "cruiseOwner") {
      // If the user is an admin, fetch all reservations
      reservations = await prisma.reservation.findMany({
        where: {
          cruiseId,
        },
      });
    } else {
      // For regular users, fetch reservations related to the given user ID
      throw new Error("this data isn't available for client");
    }

    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Error fetching reservations");
  }
}
