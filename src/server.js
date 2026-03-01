const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/attendees", require("./routes/attendeeRoutes"));
// Base Route (optional but good practice)
app.get("/", (req, res) => {
  res.json({ message: "EventEase API is running..." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});