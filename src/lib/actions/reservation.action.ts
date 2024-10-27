"use server";

export async function getAllReservations() {
  try {
    const reservations = await prisma?.reservation.findMany();
    return reservations;
  } catch (error) {
    console.log(error);
  }
}
