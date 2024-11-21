const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Management API',
      version: '1.0.0',
      description: 'A simple API for managing employees and roles',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Employee: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca', // Example of the employee's unique ID
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            age: {
              type: 'integer',
              example: 30,
            },
            class: {
              type: 'string',
              example: 'A',
            },
            subjects: {
              type: 'array',
              items: {
                type: 'string',
                example: 'Math',
              },
            },
            attendance: {
              type: 'integer',
              example: 85,
            },
            role: {
              type: 'string',
              enum: ['admin', 'employee'],
              example: 'employee',
            },
          },
        },
      },
    },
  },
security: [
      {
        BearerAuth: [],
      },
    ],
  apis: ['./routes/*.js'], // Path to the API docs (e.g., routes)

};

module.exports = swaggerOptions;
