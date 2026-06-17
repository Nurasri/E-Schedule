const express = require("express");
const router = express.Router();

const { generateJadwal } = require("../controllers/generateController");

router.post("/generate", generateJadwal);

module.exports = router;
