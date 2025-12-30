const express = require("express");
const multer = require("multer");

const {
  createManualLead,
  uploadCSV,
  updateLead,
} = require("../controllers/leadController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/manual", createManualLead);
router.post("/csv", upload.single("file"), uploadCSV);
router.put("/:id", updateLead);

module.exports = router;
