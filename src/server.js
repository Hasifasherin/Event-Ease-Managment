const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* ================= MIDDLEWARES ================= */

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      process.env.FRONTEND_URL, 
    ].filter(Boolean),
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/attendees", require("./routes/attendeeRoutes"));
app.use("/api/sliders", require("./routes/sliderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/organizer", require("./routes/organizerRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "EventEase API is running..." });
});

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});