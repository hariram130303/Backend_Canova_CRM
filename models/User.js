const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  location: String,
  language: String,
  assignLeads: { type: Number, default: true },
  role: { type: String, enum: ["admin", "sales"], default: "sales" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
});

module.exports = mongoose.model("User", userSchema);
