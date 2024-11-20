const typeDefs = `#graphql
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Int
    role: String!
  }

  type Query {
    listEmployees(filter: String, sortBy: String, page: Int, limit: Int): [Employee!]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(name: String!, age: Int!, class: String!, subjects: [String!]!, role: String!): Employee
    updateEmployee(id: ID!, name: String, age: Int, class: String, subjects: [String], attendance: Int): Employee
  }
`;

module.exports = typeDefs;
