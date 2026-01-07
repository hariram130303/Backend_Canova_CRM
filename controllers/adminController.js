const Lead = require("../models/Lead");
const User = require("../models/User");

/* ================= DASHBOARD ================= */
const getDashboard = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    // Unassigned leads
    const unassigned = await Lead.countDocuments({
      assignedTo: null,
    });

    // Assigned THIS WEEK
    const week = await Lead.countDocuments({
      assignedTo: { $ne: null },
      updatedAt: { $gte: startOfWeek },
    });

    // Active salespeople (who actually have leads)
    const active = await Lead.distinct("assignedTo", {
      assignedTo: { $ne: null },
    }).then((arr) => arr.length);

    // Conversion Rate
    const assigned = await Lead.countDocuments({
      assignedTo: { $ne: null },
    });

    const closed = await Lead.countDocuments({
      status: "Closed",
      assignedTo: { $ne: null },
    });

    const rate = assigned === 0 ? 0 : Math.round((closed / assigned) * 100);

    res.json({
      unassigned,
      week,
      active,
      rate,
    });
  } catch (err) {
    console.error(err);
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
