import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Gmail address or App Password
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export const sendSuccessEmail = async (to: string, reservationId: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Payment Successful - Reservation Confirmed",
    text: `Thank you! Your payment was successful. Reservation ID: ${reservationId}`,
    html: `<h1>Payment Successful!</h1><p>Your reservation ID is ${reservationId}. Thank you for your booking!</p>`,
  });
};
