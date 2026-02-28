const express = require("express");
const { signup, login } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Example admin route
router.get(
  "/check-admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin verified" });
  }
);

module.exports = router;