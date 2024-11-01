import "./success.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Cancel = () => {
  const router = useRouter();
  const { session_id } = router.query; // Updated to use `session_id`
  const [reservation, setReservation] = useState(null);
  console.log(reservation);
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (router.isReady && session_id) {
          // Make an API call to get reservation details using `session_id`
          const res = await fetch(`/api/reservation?session_id=${session_id}`);
          const reservationData = await res.json();
          setReservation(reservationData);
        }
      } catch (error) {
        console.error("Error fetching reservation:", error);
      }
    };

    fetchReservation();
  }, [router.isReady, session_id]);

  return (
    <div className="flex justify-center items-center">
      <div className="success-container">
        <h1 className="text-[red]">Reservation Canceled!</h1>
        <button onClick={() => router.push("/")}>Go to Home</button>
      </div>
    </div>
  );
};

export default Cancel;
