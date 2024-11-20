const Employee = require('../models/Employee');

module.exports = {
  async listEmployees(_, { filter, sortBy, page = 1, limit = 10 }) {
    const query = filter ? { name: new RegExp(filter, 'i') } : {};
    const skip = (page - 1) * limit;
    const sort = sortBy || 'name';
    return Employee.find(query).sort(sort).skip(skip).limit(limit);
  },
  async getEmployee(_, { id }) {
    return Employee.findById(id);
  },
};
