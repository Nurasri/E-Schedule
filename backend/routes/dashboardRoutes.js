const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const { getDashboard } = require("../controllers/dashboardController");

router.get("/", authenticateToken, authorizeAdmin, getDashboard);

module.exports = router;
