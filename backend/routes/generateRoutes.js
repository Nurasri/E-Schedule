const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const authorizeAdmin = require("../middleware/authorizeAdmin");

const { generateSchedule } = require("../controllers/generateController");

/*
=================================================
GENERATE JADWAL OTOMATIS
=================================================

POST /jadwal/generate

Flow:
Greedy
↓
Backtracking
↓
Simpan Database
↓
Return hasil final

Hanya dapat diakses oleh Admin.
*/

router.post("/generate", authenticateToken, authorizeAdmin, generateSchedule);

module.exports = router;
