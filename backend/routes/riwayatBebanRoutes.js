const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const authorizeAdmin = require("../middleware/authorizeAdmin");

const {
  getRiwayatBeban,
  getRiwayatBebanById,
} = require("../controllers/riwayatBebanController");

router.get("/", authenticateToken, authorizeAdmin, getRiwayatBeban);

router.get("/:id", authenticateToken, authorizeAdmin, getRiwayatBebanById);

module.exports = router;
