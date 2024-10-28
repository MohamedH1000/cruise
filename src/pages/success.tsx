import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const { reservationId } = router.query;
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const { session_id } = router.query;

    if (router.isReady && session_id) {
      fetch(`/api/reservation?session_id=${session_id}`)
        .then((res) => res.json())
        .then(setReservation)
        .catch((error) => console.error("Error fetching reservation:", error));
    }
  }, [router.isReady, router.query.session_id]);

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
