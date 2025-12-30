const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true
    },
    password: String,
    location: String,
    language: String,
    assigned: { type: Number, default: 0 },
    closed: { type: Number, default: 0 },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
