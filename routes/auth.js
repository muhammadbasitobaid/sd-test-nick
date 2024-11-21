const express = require('express');
const jwt = require('jsonwebtoken');
const AppModels = require('../models');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Logs a user in by verifying their username and password, and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: basit1008 
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Pass@123 
 *     responses:
 *       200:
 *         description: Login successful and token returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *                 token:
 *                   type: string
 *                   description: JWT token to be used for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid username or password.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Invalid username or password.
 */

/**
 * POST /auth/login
 * @summary Logs the user in and generates a token
 * @param {object} req.body - Login details (username and password)
 * @param {string} req.body.username - The username
 * @param {string} req.body.password - The password
 * @returns {object} 200 - Success response with token
 * @returns {string} 401 - Invalid username or password
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await AppModels.Employee.findOne({ username });
  if (!user) {
    return res.status(401).send('Invalid username or password.');
  }

  // Compare the provided password with the hashed password using the comparePassword method
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).send('Invalid username or password.');
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set the token as a cookie (if needed) and return the token in the response
  res.cookie('token', token, { httpOnly: true });
  res.status(200).send({ message: 'Login successful.', token });
});

module.exports = router;
