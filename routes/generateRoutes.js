const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const authorizeAdmin = require("../middleware/authorizeAdmin");

const {
  generateGreedy,
  generateFinal,
} = require("../controllers/generateController");

/*
=================================================
GREEDY PREVIEW
=================================================

POST /jadwal/generate-greedy
*/

router.post(
  "/generate-greedy",
  authenticateToken,
  authorizeAdmin,
  generateGreedy,
);

/*
=================================================
FINAL GENERATE
=================================================

POST /jadwal/generate-final
*/

router.post(
  "/generate-final",
  authenticateToken,
  authorizeAdmin,
  generateFinal,
);

module.exports = router;
