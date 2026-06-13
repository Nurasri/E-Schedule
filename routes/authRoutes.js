const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  login,
  getProfile,
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.get("/me", authenticateToken, getProfile);

module.exports = router;
