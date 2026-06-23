const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  login,
  getProfile,
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin");

router.post(
  "/register-admin",
  authenticateToken,
  authorizeAdmin,
  registerAdmin,
);

router.post("/login", login);
router.get("/me", authenticateToken, getProfile);

module.exports = router;
