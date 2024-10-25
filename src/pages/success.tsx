import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const { reservationId } = router.query;
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    if (router.isReady && reservationId) {
      fetch(`/api/reservation/${reservationId}`)
        .then((res) => res.json())
        .then(setReservation)
        .catch((error) => console.error("Error fetching reservation:", error));
    }
  }, [router.isReady, reservationId]);

  return reservation ? (
    <div>
      <h1>Reservation Success</h1>
      <p>Reservation ID: {reservation?.id}</p>
      <p>Status: {reservation?.status}</p>
      {/* Display additional reservation details */}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default SuccessPage;
