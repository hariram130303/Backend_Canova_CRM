const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");

const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  bulkDeleteEmployees,
  getOwnProfile,
  updateOwnProfile
} = require("../controllers/employeeController");

const router = express.Router();


router.get("/profile", auth, getOwnProfile);
router.put("/profile", auth, updateOwnProfile);

router.post("/", auth, isAdmin, createEmployee);
router.get("/", auth, isAdmin, getEmployees);
router.put("/:id", auth, isAdmin, updateEmployee);
router.delete("/:id", auth, isAdmin, deleteEmployee);
router.delete("/bulk", auth, isAdmin, bulkDeleteEmployees);


module.exports = router;
