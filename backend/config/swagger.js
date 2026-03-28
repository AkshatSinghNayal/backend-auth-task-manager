const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Backend Auth Task Manager API',
    version: '1.0.0',
    description: 'API docs for authentication, role-based access, and task CRUD',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Current deployment',
    },
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      UserPublic: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '67ec6f7e6f6a8a1b1d2f3c40' },
          name: { type: 'string', example: 'Akshat' },
          email: { type: 'string', format: 'email', example: 'akshat@example.com' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Akshat' },
          email: { type: 'string', format: 'email', example: 'akshat@example.com' },
          password: { type: 'string', minLength: 6, example: '123456' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'akshat@example.com' },
          password: { type: 'string', example: '123456' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/UserPublic' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67ec7d746f6a8a1b1d2f3c51' },
          title: { type: 'string', example: 'Finish backend task' },
          description: { type: 'string', example: 'Complete auth and CRUD endpoints' },
          status: {
            type: 'string',
            enum: ['pending', 'in-progress', 'completed'],
            example: 'pending',
          },
          user: { type: 'string', example: '67ec6f7e6f6a8a1b1d2f3c40' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTaskRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Finish backend task' },
          description: { type: 'string', example: 'Complete auth and CRUD endpoints' },
          status: {
            type: 'string',
            enum: ['pending', 'in-progress', 'completed'],
            example: 'pending',
          },
        },
      },
      UpdateTaskRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Finish backend task manager' },
          description: { type: 'string', example: 'Done with deployment' },
          status: {
            type: 'string',
            enum: ['pending', 'in-progress', 'completed'],
            example: 'completed',
          },
        },
      },
      UpdateRoleRequest: {
        type: 'object',
        required: ['role'],
        properties: {
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'admin',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Route not found' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Validation error or duplicate email',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current user profile',
        responses: {
          200: {
            description: 'Current user fetched',
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/admin/users': {
      get: {
        summary: 'Get all users (admin only)',
        responses: {
          200: {
            description: 'Users fetched',
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/admin/users/{id}/role': {
      patch: {
        summary: 'Update user role (admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateRoleRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Role updated successfully',
          },
          400: {
            description: 'Validation error',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    },
    '/tasks': {
      get: {
        summary: 'Get tasks',
        responses: {
          200: {
            description: 'Tasks fetched',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'number', example: 1 },
                    tasks: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTaskRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Task created successfully',
          },
          400: {
            description: 'Validation error',
          },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get task by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Task fetched',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'Task not found',
          },
        },
      },
      put: {
        summary: 'Update task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTaskRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Task updated successfully',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'Task not found',
          },
        },
      },
      delete: {
        summary: 'Delete task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Task deleted successfully',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'Task not found',
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
