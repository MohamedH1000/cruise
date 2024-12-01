import { getReservationsByUserId } from "@/lib/actions/reservation.action";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, rates } = JSON.parse(req.body);

    if (!userId || !rates) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const reservations = await getReservationsByUserId(userId, rates);
      res.status(200).json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
