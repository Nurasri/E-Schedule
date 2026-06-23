const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const {
  createTugas,
  getAllTugas,
  getTugasById,
  updateTugas,
  deleteTugas,
} = require("../controllers/tugasController");

router.post("/", authenticateToken, authorizeAdmin, createTugas);

router.get("/", authenticateToken, authorizeAdmin, getAllTugas);

router.get("/:id", authenticateToken, authorizeAdmin, getTugasById);

router.put("/:id", authenticateToken, authorizeAdmin, updateTugas);

router.delete("/:id", authenticateToken, authorizeAdmin, deleteTugas);

module.exports = router;
