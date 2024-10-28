import "./success.css";
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
