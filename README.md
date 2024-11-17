---

# GraphQL Employee Management API

A **GraphQL API** for managing employee data, built with **Node.js** and **Express.js**. This API supports operations like adding, updating, retrieving employee details, and includes pagination, sorting, and role-based access control for secure access.

---

## Features

- **GraphQL API**:
  - Query employees with optional filters and sorting.
  - Retrieve detailed information for a single employee.
  - Paginate employee data efficiently.
- **Mutations**:
  - Add a new employee.
  - Update employee details.
- **Role-Based Access Control (RBAC)**:
  - Admins and employees have different access levels.
- **Performance Optimizations**:
  - Includes query optimizations, input validation, and database indexing.

---

## Tech Stack

- **Node.js**: Runtime environment for executing JavaScript code on the server.
- **Express.js**: Web framework for building the API.
- **GraphQL**: API query language for flexible and efficient data querying.
- **MongoDB**: NoSQL database for storing employee data.
- **Mongoose**: ODM library for interacting with MongoDB.
- **JSON Web Tokens (JWT)**: For authentication and role-based authorization.
- **Bcrypt.js**: For securely hashing passwords.

---

## Project Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/muhammadbasitobaid/sd-test-nick.git
   cd sd-test-nick 
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following variables:
   ```plaintext
   MONGO_URI=mongodb://localhost:27017/employees
   JWT_SECRET=your_secret_key
   ```

4. **Run the Server**:
   Start the development server using `nodemon`:
   ```bash
   npm run dev
   ```
   The API will be available at [http://localhost:4000/graphql](http://localhost:4000/graphql).
