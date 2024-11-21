const express = require('express');
const { listEmployees, getEmployee } = require('../resolvers/Query');
const { addEmployee, updateEmployee } = require('../resolvers/Mutation');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /employees:
 *   get:
 *     summary: Get a list of employees
 *     description: Retrieves a list of employees with optional filtering, sorting, and pagination.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: filter
 *         in: query
 *         description: A search term to filter employees by name
 *         required: false
 *         schema:
 *           type: string
 *           example: John
 *       - name: sortBy
 *         in: query
 *         description: The field to sort the employees by
 *         required: false
 *         schema:
 *           type: string
 *           example: name
 *       - name: page
 *         in: query
 *         description: The page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: The number of employees per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Bad request
 */

router.get('/', auth(['employee', 'admin']), async (req, res) => {
  try {
    const { filter, sortBy, page, limit } = req.query;
    const employees = await listEmployees(null, { filter, sortBy, page, limit }, { user: req.user });
    res.status(200).json(employees);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get a single employee by ID
 *     description: Retrieves an employee's details by their unique ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the employee to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: The employee's details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Bad request
 */
router.get('/:id', auth(['employee', 'admin']), async (req, res) => {
  try {
    const employee = await getEmployee(null, { id: req.params.id }, { user: req.user });
    if (!employee) return res.status(404).send('Employee not found.');
    res.status(200).json(employee);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Add a new employee
 *     description: Adds a new employee to the system. Only accessible by an admin.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: John.Doe
 *               password:
 *                 type: string
 *                 example: Pass@123 
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               age:
 *                 type: integer
 *                 example: 30
 *               class:
 *                 type: string
 *                 example: A
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: [ "Math", "Science" ]
 *               role:
 *                 type: string
 *                 example: employee 
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Bad request
 */
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, age, class: employeeClass, subjects, role, username, password } = req.body;
    const newEmployee = await addEmployee(null, { name, age, username, password, class: employeeClass, subjects, role }, { user: req.user });
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update an existing employee
 *     description: Updates the details of an existing employee by their ID. Only accessible by an admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the employee to update
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: John.Doe
 *               password:
 *                 type: string
 *                 example: Pass@123 
 *               name:
 *                 type: string
 *                 example: John Doe
 *               age:
 *                 type: integer
 *                 example: 35
 *               class:
 *                 type: string
 *                 example: B
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: [ "English", "History" ]
 *               role:
 *                 type: string
 *                 example: employee
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const updatedEmployee = await updateEmployee(null, { id: req.params.id, ...req.body }, { user: req.user });
    if (!updatedEmployee) return res.status(404).send('Employee not found.');
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
