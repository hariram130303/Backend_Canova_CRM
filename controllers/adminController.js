const Lead = require("../models/Lead");
const User = require("../models/User");

/* ================= DASHBOARD ================= */
const getDashboard = async (req, res) => {
  try {
    const unassigned = await Lead.countDocuments({ assignedTo: null });
    const week = await Lead.countDocuments();
    const active = await User.countDocuments({
      status: "Active",
      role: "sales",
    });

    const assigned = await Lead.countDocuments();
    const closed = await Lead.countDocuments({ status: "Closed" });

    const rate = assigned ? Math.round((closed / assigned) * 100) : 0;

    res.json({ unassigned, week, active, rate });
  } catch (err) {
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
};

/* ================= UPDATE ADMIN ================= */
const updateAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  await User.findOneAndUpdate(
    { role: "admin" },
    { firstName, lastName, email, password }
  );

  res.json({ message: "Profile updated" });
};

/* ================= GET ALL LEADS ================= */
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

/* ✅ SINGLE EXPORT (IMPORTANT) */
module.exports = {
  getDashboard,
  updateAdmin,
  getLeads,
};
