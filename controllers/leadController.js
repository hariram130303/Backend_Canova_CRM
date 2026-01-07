// backend/controllers/leadController.js
const fs = require("fs");
const csv = require("csv-parser");
const Lead = require("../models/Lead");
const { assignLeadByLanguage } = require("../utils/assignLead");
const { validateCSVRow } = require("../utils/validateCSV");
const formatDate = require("../utils/formatDate");

/* ================= GET ALL LEADS (PAGINATED) ================= */
const getLeads = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const leads = await Lead.find()
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments();

    res.json({
      data: leads,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

/* ================= MANUAL LEAD ================= */
const createManualLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      source,
      date,
      location,
      language,
      type,
      scheduledDate,
    } = req.body;

    if (type === "Scheduled" && !scheduledDate) {
      return res.status(400).json({ error: "Scheduled date required" });
    }

    const assignedTo = await assignLeadByLanguage(language);

    const lead = await Lead.create({
      name,
      phone,
      email,
      source,
      date: formatDate(date),
      location,
      language,
      type,
      scheduledDate: type === "Scheduled" ? scheduledDate : null,
      status: "Ongoing",
      assignedTo,
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: "Failed to create lead" });
  }
};

/* ================= CSV UPLOAD ================= */
const uploadCSV = async (req, res) => {
  const results = [];


  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          try {
            if (validateCSVRow(row)) results.push(row);
          } catch (e) {
            reject(e);
          }
        })
        .on("error", reject)
        .on("end", resolve);
    });

    const leads = await Promise.all(
      results.map(async (row) => {
        const lang =
  (row.Language || row.language || "").toString().trim().toLowerCase();

const assignedTo = await assignLeadByLanguage(lang);

        return {
          name: row.Name,
          phone: row.Phone || null,    // optional
          email: row.Email,
          source: row.Source,
          date: formatDate(row.Date),
          location: row.Location,
          language: row.Language,
          status: "Ongoing",
          assignedTo,
        };
      })
    );

    await Lead.insertMany(leads);

    await fs.promises.unlink(req.file.path);

    res.json({ success: true, inserted: leads.length });
  } catch (err) {
    console.error("CSV upload failed:", err);
    res.status(500).json({ error: "CSV upload failed" });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Lead.findByIdAndUpdate(id, req.body, { new: true });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  getLeads,
  createManualLead,
  uploadCSV,
  updateLead,
};
