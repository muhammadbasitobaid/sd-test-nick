const Employee = require('../models/Employee');

module.exports = {
  async addEmployee(_, { name, age, class: employeeClass, subjects, role }) {
    const newEmployee = new Employee({ name, age, class: employeeClass, subjects, role });
    return newEmployee.save();
  },
  async updateEmployee(_, { id, ...fields }) {
    return Employee.findByIdAndUpdate(id, fields, { new: true });
  },
};
