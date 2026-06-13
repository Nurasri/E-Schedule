const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const {
  createKaryawan,
  getAllKaryawan,
  getKaryawanById,
  updateKaryawan,
  deleteKaryawan,
} = require("../controllers/karyawanController");

router.post("/", authenticateToken, authorizeAdmin, createKaryawan);

router.get("/", authenticateToken, authorizeAdmin, getAllKaryawan);

router.get("/:id", authenticateToken, authorizeAdmin, getKaryawanById);

router.put("/:id", authenticateToken, authorizeAdmin, updateKaryawan);

router.delete("/:id", authenticateToken, authorizeAdmin, deleteKaryawan);

module.exports = router;
