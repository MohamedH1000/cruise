import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path to Prisma client if needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  try {
    if (session_id) {
      // Look up the reservation by session ID
      const reservation = await prisma.reservation.findUnique({
        where: { sessionId: session_id },
      });

      if (!reservation) {
        return NextResponse.json(
          { error: "Reservation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(reservation, { status: 200 });
    } else {
      // Fetch all reservations if no session ID is provided
      const reservations = await prisma.reservation.findMany({
        include: {
          user: true,
          cruise: true,
        },
      });
      return NextResponse.json(reservations, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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
      sessionId,
    } = await req.json();
    const attractionIds = await prisma.attractions.findMany({
      where: { name: { in: attractions } },
      select: { id: true },
    });
    const attractionConnectData = attractionIds.map((attraction) => ({
      id: attraction.id,
    }));
    let isDelivery = true;
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
        isDelivery,
        userId,
        attractions: { connect: attractionConnectData }, // assuming `attractions` is a relation
        sessionId,
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
    const { reservId, status, sessionId } = await req.json();
    const updatedData: any = {};
    if (status) updatedData.status = status;
    if (sessionId) updatedData.sessionId = sessionId;
    // Update reservation with the given ID and new status
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservId },
      data: { status, sessionId },
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

export async function DELETE(req: NextRequest) {
  try {
    const { reservId } = await req.json();

    // Delete reservation with the given ID
    await prisma.reservation.delete({
      where: { id: reservId },
    });

    return NextResponse.json(
      { message: "Reservation deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Error deleting reservation" },
      { status: 500 }
    );
  }
}
