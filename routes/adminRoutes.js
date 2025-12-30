// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

const { getDashboard, updateAdmin } = require("../controllers/adminController");
const {
  getEmployees,
  createEmployee,
  bulkDeleteEmployees,
  updateEmployee
} = require("../controllers/employeeController");

const {
  getLeads,
  createManualLead,
  uploadCSV,
  updateLead,
} = require("../controllers/leadController");

const upload = multer({ dest: "uploads/" });

/* ================= DASHBOARD ================= */
router.get("/dashboard", getDashboard);

/* ================= EMPLOYEES ================= */
router.get("/employees", getEmployees);
router.post("/employees", createEmployee);
router.put("/employees/:id", updateEmployee);

router.delete("/employees", bulkDeleteEmployees);


/* ================= LEADS ================= */
router.get("/leads", getLeads);

/* Manual Lead Creation */
router.post("/leads/manual", createManualLead);

/* CSV Upload */
router.post("/leads/csv", upload.single("file"), uploadCSV);

router.put("/leads/:id", updateLead);


/* ================= SETTINGS ================= */
router.put("/settings", updateAdmin);

module.exports = router;
