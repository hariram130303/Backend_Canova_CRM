const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    source: String,
    date: String,
    location: String,
    language: String,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    status: {
      type: String,
      default: "Ongoing",
    },

    type: {
      type: String,
      enum: ["Hot", "Warm", "Cold", "Scheduled"],
      default: "Cold",
    },

    scheduledDate: 
    { type: String,},
  },
  { timestamps: true }
);

LeadSchema.index({ language: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ status: 1 });

module.exports = mongoose.model("Lead", LeadSchema);
