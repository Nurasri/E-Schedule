const express = require("express");

const router = express.Router();

const { generateSchedule } = require("../controllers/generateController");

/*
  Endpoint Generate Jadwal Greedy

  POST /api/jadwal/generate
*/

// Hanya admin yang dapat generate
const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin");

router.post("/generate", authenticateToken, authorizeAdmin, generateSchedule);

module.exports = router;
