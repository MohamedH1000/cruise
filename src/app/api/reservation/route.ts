import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path to Prisma client if needed

export async function POST(req: NextRequest) {
  try {
    const {
      name: nameOfReserver,
      email,
      phoneNumber,
      dateRange,
      status,
      totalPrice,
      currency,
      cruiseId,
      userId,
      attractions,
    } = await req.json();
    const attractionIds = await prisma.attractions.findMany({
      where: { name: { in: attractions } },
      select: { id: true },
    });
    const attractionConnectData = attractionIds.map((attraction) => ({
      id: attraction.id,
    }));
    // Create a new reservation in the database using Prisma
    const reservation = await prisma.reservation.create({
      data: {
        nameOfReserver,
        email,
        phoneNumber,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        status,
        totalPrice,
        currency,
        cruiseId,
        userId,
        attractions: { connect: attractionConnectData }, // assuming `attractions` is a relation
      },
    });

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Error creating reservation" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { reservationId, status } = await req.json();

    // Update reservation with the given ID and new status
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
    });

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    console.error("Error updating reservation status:", error);
    return NextResponse.json(
      { error: "Error updating reservation status" },
      { status: 500 }
    );
  }
}
