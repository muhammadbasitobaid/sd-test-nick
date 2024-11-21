const Employee = require('../models/Employee');
const { checkRole } = require('../helpers/authorization'); // Import the role-check utility

module.exports = {
  async addEmployee(_, { username, name, age, class: employeeClass, subjects, role, password }, { user }) {
    
    // Check if the username already exists
    const existingEmployee = await Employee.findOne({ username });
    if (existingEmployee?.username) {
      throw new Error('Username already taken.');
    }
    console.log(username, password)

    // Create a new employee with a hashed password
    const newEmployee = new Employee({
      username,
      name,
      age,
      class: employeeClass,
      subjects,
      role,
      password, // Password will be hashed in the pre-save hook
    });

    return newEmployee.save();
  },

  async updateEmployee(_, { id, username, password, ...fields }, { user }) {

    // Find the employee by id
    const employee = await Employee.findById(id);
    if (!employee) throw new Error('Employee not found.');

    // Check if the username is being updated and if it's unique
    if (username && username !== employee.username) {
      const existingEmployee = await Employee.findOne({ username });
      if (existingEmployee?.username) {
        throw new Error('Username already taken.');
      }
      employee.username = username;
    }

    // If a password is provided, hash it before updating
    if (password) {
      employee.password = password; // This will trigger the pre-save hook
    }

    // Update other fields
    Object.assign(employee, fields);

    return employee.save();
  },
};
