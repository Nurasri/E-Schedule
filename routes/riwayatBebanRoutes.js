const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const { getRiwayatBeban } = require("../controllers/riwayatBebanController");

router.get("/", authenticateToken, authorizeAdmin, getRiwayatBeban);

module.exports = router;
