const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find employee
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // compare using bcrypt ALWAYS
    const valid = await bcrypt.compare(password, employee.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // token
    const token = jwt.sign(
      {
        id: employee._id,
        role: "employee",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      employee: {
        id: employee._id,
        name: employee.firstName + " " + employee.lastName,
        email: employee.email,
        firstLogin: employee.firstLogin
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    const hashed = await bcrypt.hash(newPassword, 10);

    await Employee.findByIdAndUpdate(userId, {
      password: hashed,
      firstLogin: false
    });

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
