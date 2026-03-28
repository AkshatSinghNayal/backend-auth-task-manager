const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Backend Auth Task Manager API',
    version: '1.0.0',
    description: 'Simple API docs for auth and task routes',
  },
  servers: [
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
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current user profile',
      },
    },
    '/auth/admin/users': {
      get: {
        summary: 'Get all users (admin only)',
      },
    },
    '/auth/admin/users/{id}/role': {
      patch: {
        summary: 'Update user role (admin only)',
      },
    },
    '/tasks': {
      get: {
        summary: 'Get tasks',
      },
      post: {
        summary: 'Create a task',
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get task by id',
      },
      put: {
        summary: 'Update task',
      },
      delete: {
        summary: 'Delete task',
      },
    },
  },
};

module.exports = swaggerDocument;
