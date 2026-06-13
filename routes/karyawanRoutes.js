const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  createKaryawan,
  getAllKaryawan,
  getKaryawanById,
  updateKaryawan,
  deleteKaryawan,
} = require("../controllers/karyawanController");

router.post("/", authenticateToken, createKaryawan);
router.get("/", authenticateToken, getAllKaryawan);
router.get("/:id", authenticateToken, getKaryawanById);
router.put("/:id", authenticateToken, updateKaryawan);
router.delete("/:id", authenticateToken, deleteKaryawan);

module.exports = router;
