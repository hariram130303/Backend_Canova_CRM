const Lead = require("../models/Lead");
const Employee = require("../models/Employee");

const assignLeadByLanguage = async (language) => {
  let employees = await Employee.find({ language }).sort({ _id: 1 });

  // If no employee with matching language → fallback to all employees
  if (!employees.length) {
    console.log("No exact language match. Using all employees.");
    employees = await Employee.find().sort({ _id: 1 });

    if (!employees.length) return null;
  }

  for (const emp of employees) {
    const count = await Lead.countDocuments({
      assignedTo: emp._id,
      status: "Ongoing",
    });

    if (count < 3) return emp._id;
  }

  return employees[0]._id;
};

module.exports = { assignLeadByLanguage };
