const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emp = await Employee.findOne({ email });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    const match = await bcrypt.compare(password, emp.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: emp._id, role: "employee" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};