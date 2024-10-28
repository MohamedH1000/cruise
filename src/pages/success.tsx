import "./success.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query; // Updated to use `session_id`
  const [reservation, setReservation] = useState(null);

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

  return reservation ? (
    <div className="success-container">
      <h1>🎉 Reservation Confirmed!</h1>
      <div className="reservation-info">
        <p>
          <strong>Reservation ID:</strong> {reservation?.id}
        </p>
        <p>
          <strong>Name:</strong> {reservation?.nameOfReserver}
        </p>
        <p>
          <strong>Email:</strong> {reservation?.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {reservation?.phoneNumber}
        </p>
        <p>
          <strong>Status:</strong> {reservation?.status}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(reservation?.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(reservation?.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Total Price:</strong> {reservation?.totalPrice / 100}{" "}
          {reservation?.currency}
        </p>
      </div>
      <button onClick={() => router.push("/")}>Go to Home</button>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default SuccessPage;
