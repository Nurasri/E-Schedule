const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  deleteJadwal,
} = require("../controllers/jadwalController");

router.post("/", authenticateToken, authorizeAdmin, createJadwal);

router.get("/", authenticateToken, authorizeAdmin, getAllJadwal);

router.get("/:id", authenticateToken, authorizeAdmin, getJadwalById);

router.delete("/:id", authenticateToken, authorizeAdmin, deleteJadwal);

module.exports = router;
