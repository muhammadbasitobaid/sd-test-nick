const typeDefs = `#graphql
  type Employee {
    id: ID!
    username: String!   # Added the username field
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Int
    role: String!
    password: String!
  }

  type Query {
    listEmployees(filter: String, sortBy: String, page: Int, limit: Int): [Employee!]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(username: String!, name: String!, age: Int!, class: String!, subjects: [String!]!, role: String!, password: String!): Employee
    updateEmployee(id: ID!, username: String, name: String, age: Int, class: String, subjects: [String], attendance: Int, role: String): Employee
  }
`;

module.exports = typeDefs;
