const Employee = require('../models/Employee');
const { checkRole } = require('../helpers/authorization'); // Import the role-check utility

module.exports = {
  async listEmployees(_, { filter, sortBy, page = 1, limit = 10 }, { user }) {
    // Allow both 'employee' and 'admin' roles to view the list of employees
    checkRole(user, ['employee', 'admin']);

    const query = filter ? { name: new RegExp(filter, 'i') } : {};
    const skip = (page - 1) * limit;
    const sort = sortBy || 'name';

    // Exclude the password field from the returned data
    return Employee.find(query, '-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  },

  async getEmployee(_, { id }, { user }) {
    // Allow both 'employee' and 'admin' roles to view a single employee
    checkRole(user, ['employee', 'admin']);

    // Exclude the password field from the returned data
    return Employee.findById(id, '-password');
  },
};
