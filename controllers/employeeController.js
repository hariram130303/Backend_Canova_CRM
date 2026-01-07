const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const Lead = require("../models/Lead");

/* ---------- CREATE EMPLOYEE ---------- */
const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, location, language } = req.body;

    const hashed = await bcrypt.hash(email, 10);

    const emp = await Employee.create({
      firstName,
      lastName,
      email,
      password: hashed,
      location,
      language
    });

    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- GET EMPLOYEES (PAGINATION) ---------- */
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().lean();

    const leadStats = await Lead.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          assigned: { $sum: 1 },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const map = {};
    leadStats.forEach((s) => (map[s._id?.toString()] = s));

    const enriched = employees.map((emp) => ({
      ...emp,
      assigned: map[emp._id]?.assigned || 0,
      closed: map[emp._id]?.closed || 0,
    }));

    res.json({ data: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load employees" });
  }
};

/* ---------- UPDATE EMPLOYEE ---------- */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Employee.findByIdAndUpdate(
      id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        ...(req.body.password && { password: req.body.password })
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update employee" });
  }
};

/* ---------- DELETE SINGLE ---------- */
const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- BULK DELETE ---------- */
const bulkDeleteEmployees = async (req, res) => {
  try {
    const { ids } = req.body;

    await Employee.deleteMany({ _id: { $in: ids } });

    res.json({ message: "Employees deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOwnProfile = async (req, res) => {
  try {
    const emp = await Employee.findById(req.user.id).select("-password");
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
};

const updateOwnProfile = async (req, res) => {
  try {
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };

    if (req.body.password) {
      data.password = await bcrypt.hash(req.body.password, 10);
      data.firstLogin = false;
    }

    const updated = await Employee.findByIdAndUpdate(req.user.id, data, { new: true });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};



module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  bulkDeleteEmployees,
  getOwnProfile,
  updateOwnProfile
};
