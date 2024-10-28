import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path to Prisma client if needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reservationId = searchParams.get("reservationId");

  if (!reservationId) {
    return NextResponse.json(
      { error: "Reservation ID is required" },
      { status: 400 }
    );
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { attractions: true }, // Adjust fields as needed
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Error fetching reservation" },
      { status: 500 }
    );
  }
}

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
    const { reservId, status } = await req.json();

    // Update reservation with the given ID and new status
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservId },
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
