// File: utils/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc';

// Define a basic type for the Swagger spec (expand as needed)
export interface SwaggerSpec {
    openapi: string; // e.g., "3.0.0"
    info: {
        title: string;
        version: string;
        description?: string;
    };
    paths?: Record<string, unknown>; // Use unknown here for flexibility
    components?: Record<string, unknown>; // Optional
}

export const getApiDocs = async (): Promise<Record<string, unknown>> => {
    const spec = createSwaggerSpec({
        apiFolder: 'app/api', // Root folder for your API routes
        definition: {
            openapi: '3.0.0', // Add OpenAPI version
            info: {
                title: 'Next.js API Documentation',
                version: '1.0.0',
                description: 'This is the API documentation for the Next.js project.',
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
                schemas: {
                    "Category": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "integer",
                                "description": "The ID of the category"
                            },
                            "name": {
                                "type": "string",
                                "description": "The name of the category"
                            },
                            "description": {
                                "type": "string",
                                "description": "Description of the category"
                            },
                            "createdAt": {
                                "type": "string",
                                "format": "date-time",
                                "description": "Timestamp when the category was created"
                            }
                        }
                    },
                    "CategoryInput": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "The name of the category",
                                "example": "Employee of the Month"
                            },
                            "description": {
                                "type": "string",
                                "description": "Description of the category",
                                "example": "Rewards for outstanding employees"
                            }
                        }
                    },
                    "CategoryUpdate": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "integer",
                                "description": "The ID of the category"
                            },
                            "name": {
                                "type": "string",
                                "description": "The updated name of the category"
                            },
                            "description": {
                                "type": "string",
                                "description": "The updated description of the category"
                            }
                        }
                    },
                    "Reward": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "integer",
                                "description": "The ID of the reward"
                            },
                            "employeeId": {
                                "type": "integer",
                                "description": "The ID of the associated employee"
                            },
                            "earnedDate": {
                                "type": "string",
                                "format": "date-time",
                                "description": "The date the reward was earned"
                            },
                            "departmentId": {
                                "type": "integer",
                                "description": "The ID of the associated department"
                            },
                            "categoryId": {
                                "type": "integer",
                                "description": "The ID of the associated category"
                            },
                            "pointsEarned": {
                                "type": "integer",
                                "description": "Points earned for the reward"
                            },
                            "progress": {
                                "type": "number",
                                "format": "float",
                                "description": "Progress percentage towards the reward"
                            },
                            "createdAt": {
                                "type": "string",
                                "format": "date-time",
                                "description": "Timestamp when the reward was created"
                            }
                        }
                    },
                    "RewardInput": {
                        "type": "object",
                        "properties": {
                            "employeeId": {
                                "type": "integer",
                                "description": "The ID of the employee earning the reward"
                            },
                            "earnedDate": {
                                "type": "string",
                                "format": "date-time",
                                "description": "The date the reward was earned"
                            },
                            "departmentId": {
                                "type": "integer",
                                "description": "The ID of the department"
                            },
                            "categoryId": {
                                "type": "integer",
                                "description": "The ID of the reward category"
                            },
                            "pointsEarned": {
                                "type": "integer",
                                "description": "Points earned for the reward"
                            },
                            "progress": {
                                "type": "number",
                                "format": "float",
                                "description": "Progress percentage towards the reward"
                            }
                        }
                    },
                    "RewardUpdate": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "integer",
                                "description": "The ID of the reward"
                            },
                            "employeeId": {
                                "type": "integer",
                                "description": "The updated ID of the employee earning the reward"
                            },
                            "earnedDate": {
                                "type": "string",
                                "format": "date-time",
                                "description": "The updated date the reward was earned"
                            },
                            "departmentId": {
                                "type": "integer",
                                "description": "The updated ID of the department"
                            },
                            "categoryId": {
                                "type": "integer",
                                "description": "The updated ID of the reward category"
                            },
                            "pointsEarned": {
                                "type": "integer",
                                "description": "Updated points earned for the reward"
                            },
                            "progress": {
                                "type": "number",
                                "format": "float",
                                "description": "Updated progress percentage towards the reward"
                            }
                        }
                    }
                }

            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
            servers: [
                {
                    url: '/api',
                    description: 'Next.js API server',
                },
            ],
            tags: [
                { name: 'Employees', description: 'Endpoints related to managing employees' },
                { name: 'Auth', description: 'Endpoints related to user authentication' },
                { name: 'Upload', description: 'Endpoints related to file uploads' },
                { name: "Departments", description: "Endpoints related to managing departments" },
                { name: "Teams", description: "Endpoints related to managing teams" },
                { name: "Categories", description: "Endpoints related to managing categories" },
                { name: "Rewards", description: "Endpoints related to managing rewards" },
                { name: 'Attendance', description: 'Endpoints related to managing attendance records' },
            ],
            paths: {
                // Employees Routes
                '/employees': {
                    get: {
                        tags: ['Employees'],
                        summary: 'Get all employees',
                        description: 'Retrieve a list of all employees from the database.',
                        responses: {
                            200: {
                                description: 'A list of employees',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    name: { type: 'string' },
                                                    working_days: { type: 'integer' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    post: {
                        tags: ['Employees'],
                        summary: 'Create a new employee',
                        description: 'Add a new employee to the database.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            working_days: { type: 'integer' },
                                        },
                                        required: ['name', 'working_days'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'The newly created employee',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                name: { type: 'string' },
                                                working_days: { type: 'integer' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    put: {
                        tags: ['Employees'],
                        summary: 'Update an employee',
                        description: 'Update an employee by their ID.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', description: 'ID of the employee' },
                                            name: { type: 'string', description: 'Name of the employee' },
                                            working_days: { type: 'integer', description: 'Working days of the employee' },
                                        },
                                        required: ['id'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'The updated employee',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                name: { type: 'string' },
                                                working_days: { type: 'integer' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'Invalid ID provided',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            404: {
                                description: 'Employee not found',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    delete: {
                        tags: ['Employees'],
                        summary: 'Delete an employee',
                        description: 'Delete an employee by their ID.',
                        parameters: [
                            {
                                name: 'id',
                                in: 'query',
                                required: true,
                                schema: { type: 'integer' },
                                description: 'ID of the employee to delete',
                            },
                        ],
                        responses: {
                            200: {
                                description: 'Employee deleted successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'Employee ID is required',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            404: {
                                description: 'Employee not found or deletion failed',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                // Auth Routes
                '/auth/login': {
                    post: {
                        tags: ['Auth'],
                        summary: 'User login',
                        description: 'Authenticate a user and generate a JWT token.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string' },
                                            password: { type: 'string' },
                                        },
                                        required: ['email', 'password'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'JWT token generated',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                token: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            401: {
                                description: 'Unauthorized, invalid credentials',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/auth/register': {
                    post: {
                        tags: ['Auth'],
                        summary: 'User registration',
                        description: 'Register a new user.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            username: { type: 'string' },
                                            email: { type: 'string' },
                                            password: { type: 'string' },
                                        },
                                        required: ['username', 'email', 'password'],
                                    },
                                },
                            },
                        },
                        responses: {
                            201: {
                                description: 'User registered successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                username: { type: 'string' },
                                                email: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'Invalid registration details',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/auth/forgot-password': {
                    post: {
                        tags: ['Auth'],
                        summary: 'Forgot password',
                        description: 'Send password reset instructions to the user.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string' },
                                        },
                                        required: ['email'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'Password reset instructions sent',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/auth/resend-otp': {
                    post: {
                        tags: ['Auth'],
                        summary: 'Resend OTP',
                        description: 'Resend OTP for account verification.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string' },
                                        },
                                        required: ['email'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'OTP resent',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/auth/send-verify-otp': {
                    post: {
                        tags: ['Auth'],
                        summary: 'Send verification OTP',
                        description: 'Send OTP to verify the user\'s account.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string' },
                                        },
                                        required: ['email'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'Verification OTP sent',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/auth/verify-otp': {
                    post: {
                        tags: ['Auth'],
                        summary: 'Verify OTP for password reset',
                        description: 'Verify the OTP sent to reset the user\'s password.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string' },
                                            otp: { type: 'string' },
                                        },
                                        required: ['email', 'otp'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'OTP verified',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'Invalid OTP or email',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                // Profile Routes
                "/profile/update": {
                    "patch": {
                        "tags": ["User"],
                        "summary": "Update user profile",
                        "description": "Updates the user's profile information including profile image, name, email, and designation.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "multipart/form-data": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "name": { "type": "string" },
                                            "email": { "type": "string" },
                                            "designation": { "type": "string" },
                                            "file": { "type": "string", "format": "binary" },
                                            "profileImageUrl": { "type": "string" }
                                        }
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "Profile updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": { "type": "string" },
                                                "user": { "type": "object" }
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "Failed to update profile",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/profile/change-password": {
                    "patch": {
                        "tags": ["Auth"],
                        "summary": "Change user password",
                        "description": "Allows users to change their password.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "oldPassword": { "type": "string" },
                                            "newPassword": { "type": "string" }
                                        },
                                        "required": ["oldPassword", "newPassword"]
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "Password changed successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "Incorrect old password",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                // Upload Routes
                '/upload/file': {
                    post: {
                        tags: ['Upload'],
                        summary: 'File upload',
                        description: 'Upload a file to the server.',
                        requestBody: {
                            required: true,
                            content: {
                                'multipart/form-data': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            file: {
                                                type: 'string',
                                                format: 'binary',
                                            },
                                        },
                                        required: ['file'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'File uploaded successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                url: { type: 'string' },
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'File upload failed',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                // Departments Routes
                "/departments": {
                    "get": {
                        "tags": ["Departments"],
                        "summary": "Get all departments",
                        "description": "Retrieve a list of all departments from the database, including related teams, department head, employees, and rewards.",
                        "responses": {
                            "200": {
                                "description": "A list of departments",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "id": { "type": "integer" },
                                                    "name": { "type": "string" },
                                                    "description": { "type": "string" },
                                                    "teams": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "id": { "type": "integer" },
                                                                "name": { "type": "string" }
                                                            }
                                                        }
                                                    },
                                                    "departmentHead": {
                                                        "type": "object",
                                                        "properties": {
                                                            "id": { "type": "integer" },
                                                            "name": { "type": "string" }
                                                        }
                                                    },
                                                    "employees": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "id": { "type": "integer" },
                                                                "name": { "type": "string" }
                                                            }
                                                        }
                                                    },
                                                    "rewards": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "id": { "type": "integer" },
                                                                "name": { "type": "string" },
                                                                "description": { "type": "string" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "post": {
                        "tags": ["Departments"],
                        "summary": "Create a new department",
                        "description": "Add a new department to the database.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "name": { "type": "string" },
                                            "description": { "type": "string" }
                                        },
                                        "required": ["name"]
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "The newly created department",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "id": { "type": "integer" },
                                                "name": { "type": "string" },
                                                "description": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "put": {
                        "tags": ["Departments"],
                        "summary": "Update a department by ID",
                        "description": "Update an existing department using its ID, sent in the request body.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "id": { "type": "integer" },
                                            "name": { "type": "string" },
                                            "description": { "type": "string" }
                                        },
                                        "required": ["id"]
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "The updated department",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "id": { "type": "integer" },
                                                "name": { "type": "string" },
                                                "description": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID provided",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "delete": {
                        "tags": ["Departments"],
                        "summary": "Delete a department by ID",
                        "description": "Delete a department from the database using the department's ID as a query parameter.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "query",
                                "required": true,
                                "schema": { "type": "integer" },
                                "description": "ID of the department to delete"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Department deleted successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Department ID is required or invalid",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                // Teams Routes
                "/teams": {
                    "get": {
                        "tags": ["Teams"],
                        "summary": "Get all teams",
                        "description": "Retrieve a list of all teams from the database.",
                        "responses": {
                            "200": {
                                "description": "A list of teams",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "id": { "type": "integer" },
                                                    "name": { "type": "string" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "post": {
                        "tags": ["Teams"],
                        "summary": "Create a new team",
                        "description": "Add a new team to the database.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "name": { "type": "string" }
                                        },
                                        "required": ["name"]
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "The newly created team",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "id": { "type": "integer" },
                                                "name": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "put": {
                        "tags": ["Teams"],
                        "summary": "Update a team by ID",
                        "description": "Update an existing team by providing the team ID and updated data.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "query",
                                "required": true,
                                "schema": { "type": "integer" },
                                "description": "ID of the team"
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "name": { "type": "string" }
                                        }
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "The updated team",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "id": { "type": "integer" },
                                                "name": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID provided",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    },
                    "delete": {
                        "tags": ["Teams"],
                        "summary": "Delete a team by ID",
                        "description": "Delete a team by providing the team ID as a query parameter.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "query",
                                "required": true,
                                "schema": { "type": "integer" },
                                "description": "ID of the team to delete"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Team deleted successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Team ID is required",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                // Category Routes
                "/categories": {
                    "get": {
                        "tags": ["Categories"],
                        "summary": "Get all categories",
                        "description": "Retrieve a list of all available categories.",
                        "responses": {
                            "200": {
                                "description": "A list of categories",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Category"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "post": {
                        "tags": ["Categories"],
                        "summary": "Create a new category",
                        "description": "Add a new category to the system.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/CategoryInput"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "Category created successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Category"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "put": {
                        "tags": ["Categories"],
                        "summary": "Update a category",
                        "description": "Update details of an existing category.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/CategoryUpdate"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "Category updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Category"
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID provided",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "delete": {
                        "tags": ["Categories"],
                        "summary": "Delete a category",
                        "description": "Delete a category by its ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "query",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the category to delete"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Category deleted successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Category ID is required",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                // Rewards Routes
                "/rewards": {
                    "get": {
                        "tags": ["Rewards"],
                        "summary": "Get all rewards",
                        "description": "Retrieve a list of all rewards with their associated details.",
                        "responses": {
                            "200": {
                                "description": "A list of rewards",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Reward"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "post": {
                        "tags": ["Rewards"],
                        "summary": "Create a new reward",
                        "description": "Add a new reward to the system.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/RewardInput"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "Reward created successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Reward"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "put": {
                        "tags": ["Rewards"],
                        "summary": "Update a reward",
                        "description": "Update details of an existing reward.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/RewardUpdate"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "Reward updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Reward"
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID provided",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "delete": {
                        "tags": ["Rewards"],
                        "summary": "Delete a reward",
                        "description": "Delete a reward by its ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "query",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the reward to delete"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Reward deleted successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Reward ID is required",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "error": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/attendance': {
                    get: {
                        tags: ['Attendance'],
                        summary: 'Get all attendance records',
                        description: 'Retrieve a list of all attendance records from the database, including team information.',
                        responses: {
                            200: {
                                description: 'A list of attendance records',
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            checkIn: { type: 'string', format: 'date-time' },
                                            status: { type: 'string' },
                                            type: { type: 'string' },
                                            employeeId: { type: 'integer' },
                                            employee: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    name: { type: 'string' },
                                                    email: { type: 'string' },
                                                },
                                            },
                                            teamId: { type: 'integer' },
                                            team: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    name: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            500: {
                                description: 'Failed to retrieve attendance records',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    post: {
                        tags: ['Attendance'],
                        summary: 'Create a new attendance record',
                        description: 'Add a new attendance record to the database, including team information.',
                        parameters: [
                            {
                                in: 'body',
                                name: 'body',
                                required: true,
                                schema: {
                                    type: 'object',
                                    properties: {
                                        checkIn: { type: 'string', format: 'date-time' },
                                        status: { type: 'string', enum: ['Present', 'Absent', 'Late'] },
                                        type: { type: 'string', enum: ['Full-time', 'Part-time'] },
                                        employeeId: { type: 'integer' },
                                        teamId: { type: 'integer' },
                                    },
                                    required: ['checkIn', 'status', 'type', 'employeeId', 'teamId'],
                                },
                            },
                        ],
                        responses: {
                            201: {
                                description: 'The newly created attendance record',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        checkIn: { type: 'string', format: 'date-time' },
                                        status: { type: 'string' },
                                        type: { type: 'string' },
                                        employeeId: { type: 'integer' },
                                        teamId: { type: 'integer' },
                                        team: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                name: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'Invalid input data',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                            500: {
                                description: 'Failed to create attendance record',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    put: {
                        tags: ['Attendance'],
                        summary: 'Update an existing attendance record',
                        description: 'Update an attendance record by its ID, including team information.',
                        parameters: [
                            {
                                in: 'body',
                                name: 'body',
                                required: true,
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        checkIn: { type: 'string', format: 'date-time', nullable: true },
                                        status: { type: 'string', enum: ['Present', 'Absent', 'Late'], nullable: true },
                                        type: { type: 'string', enum: ['Full-time', 'Part-time'], nullable: true },
                                        employeeId: { type: 'integer', nullable: true },
                                        teamId: { type: 'integer', nullable: true },
                                    },
                                    required: ['id'],
                                },
                            },
                        ],
                        responses: {
                            200: {
                                description: 'The updated attendance record',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        checkIn: { type: 'string', format: 'date-time' },
                                        status: { type: 'string' },
                                        type: { type: 'string' },
                                        employeeId: { type: 'integer' },
                                        teamId: { type: 'integer' },
                                        team: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                name: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'Invalid ID provided',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                            404: {
                                description: 'Attendance record not found',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                            500: {
                                description: 'Failed to update attendance record',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    delete: {
                        tags: ['Attendance'],
                        summary: 'Delete an attendance record',
                        description: 'Delete an attendance record by its ID.',
                        parameters: [
                            {
                                in: 'query',
                                name: 'id',
                                required: true,
                                type: 'integer',
                                description: 'ID of the attendance record to delete',
                            },
                        ],
                        responses: {
                            200: {
                                description: 'Attendance record deleted successfully',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                    },
                                },
                            },
                            400: {
                                description: 'Attendance ID is required',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                            404: {
                                description: 'Attendance record not found',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                            500: {
                                description: 'Failed to delete attendance record',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
                '/onboarding-stats': {
                    get: {
                        tags: ['Onboarding'],
                        summary: 'Get employee onboarding statistics',
                        description: 'Retrieve the number of employees onboarded, grouped by month and department.',
                        responses: {
                            200: {
                                description: 'A list of monthly onboarding statistics',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                months: {
                                                    type: 'array',
                                                    description: 'The months with onboarding statistics',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            month: {
                                                                type: 'string',
                                                                description: 'The name of the month (e.g., "Jan", "Feb", etc.)',
                                                            },
                                                            totalOnboarded: {
                                                                type: 'integer',
                                                                description: 'The total number of employees onboarded in that month',
                                                            },
                                                            departments: {
                                                                type: 'array',
                                                                description: 'Onboarding statistics per department for the month',
                                                                items: {
                                                                    type: 'object',
                                                                    properties: {
                                                                        departmentName: {
                                                                            type: 'string',
                                                                            description: 'The name of the department',
                                                                        },
                                                                        onboardedCount: {
                                                                            type: 'integer',
                                                                            description: 'The number of employees onboarded in the department',
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            500: {
                                description: 'Failed to retrieve onboarding statistics',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                "/announcements": {
                    "get": {
                        "tags": ["Announcements"],
                        "summary": "Get all announcements",
                        "description": "Retrieve a list of all announcements.",
                        "responses": {
                            "200": {
                                "description": "A list of announcements",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Announcement"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "post": {
                        "tags": ["Announcements"],
                        "summary": "Create a new announcement",
                        "description": "Add a new announcement.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/AnnouncementInput"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "Announcement created successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Announcement"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/announcements/{id}": {
                    "get": {
                        "tags": ["Announcements"],
                        "summary": "Get an announcement by ID",
                        "description": "Retrieve a single announcement by its ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "path",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the announcement"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Announcement details",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Announcement"
                                        }
                                    }
                                }
                            },
                            "404": {
                                "description": "Announcement not found"
                            }
                        }
                    },
                    "put": {
                        "tags": ["Announcements"],
                        "summary": "Update an announcement by ID",
                        "description": "Update an existing announcement by ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "path",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the announcement"
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/AnnouncementUpdate"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "Announcement updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Announcement"
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID"
                            }
                        }
                    },
                    "delete": {
                        "tags": ["Announcements"],
                        "summary": "Delete an announcement by ID",
                        "description": "Delete an announcement by its ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "path",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the announcement"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Announcement deleted successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": {
                                                    "type": "string",
                                                    "example": "Announcement deleted successfully"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID or Announcement not found"
                            }
                        }
                    }
                },
                "/schedules": {
                    "get": {
                        "tags": ["Schedules"],
                        "summary": "Get all schedules",
                        "description": "Retrieve a list of all schedules.",
                        "responses": {
                            "200": {
                                "description": "A list of schedules",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Schedule"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "post": {
                        "tags": ["Schedules"],
                        "summary": "Create a new schedule",
                        "description": "Add a new schedule.",
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ScheduleInput"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "Schedule created successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Schedule"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/schedules/{id}": {
                    "get": {
                        "tags": ["Schedules"],
                        "summary": "Get a schedule by ID",
                        "description": "Retrieve a single schedule by its ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "path",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the schedule"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Schedule details",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Schedule"
                                        }
                                    }
                                }
                            },
                            "404": {
                                "description": "Schedule not found"
                            }
                        }
                    },
                    "put": {
                        "tags": ["Schedules"],
                        "summary": "Update a schedule by ID",
                        "description": "Update an existing schedule by ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "path",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the schedule"
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ScheduleUpdate"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "Schedule updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Schedule"
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID"
                            }
                        }
                    },
                    "delete": {
                        "tags": ["Schedules"],
                        "summary": "Delete a schedule by ID",
                        "description": "Delete a schedule by its ID.",
                        "parameters": [
                            {
                                "name": "id",
                                "in": "path",
                                "required": true,
                                "schema": {
                                    "type": "integer"
                                },
                                "description": "ID of the schedule"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Schedule deleted successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "message": {
                                                    "type": "string",
                                                    "example": "Schedule deleted successfully"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "Invalid ID or Schedule not found"
                            }
                        }
                    }
                },
                // Swagger documentation for the survey routes
                '/surveys': {
                    get: {
                        tags: ['Surveys'],
                        summary: 'Get all surveys',
                        description: 'Retrieve a list of all surveys from the database.',
                        responses: {
                            200: {
                                description: 'A list of surveys',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    title: { type: 'string' },
                                                    description: { type: 'string' },
                                                    category: { type: 'string' },
                                                    createdAt: { type: 'string', format: 'date-time' },
                                                    updatedAt: { type: 'string', format: 'date-time' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    post: {
                        tags: ['Surveys'],
                        summary: 'Create a new survey',
                        description: 'Add a new survey to the database.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            title: { type: 'string' },
                                            description: { type: 'string' },
                                            category: { type: 'string' },
                                            questions: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        text: { type: 'string' },
                                                        type: { type: 'string' }, // Example: 'text', 'radio', 'checkbox', 'scale'
                                                        options: {
                                                            type: 'array',
                                                            items: { type: 'string' },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        required: ['title', 'description', 'category', 'questions'],
                                    },
                                },
                            },
                        },
                        responses: {
                            201: {
                                description: 'The newly created survey',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                title: { type: 'string' },
                                                description: { type: 'string' },
                                                category: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            400: {
                                description: 'Invalid input',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/surveys/{id}': {
                    get: {
                        tags: ['Surveys'],
                        summary: 'Get a survey by ID',
                        description: 'Retrieve details of a survey by its ID.',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: { type: 'integer' },
                                description: 'ID of the survey to retrieve',
                            },
                        ],
                        responses: {
                            200: {
                                description: 'Survey details',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                title: { type: 'string' },
                                                description: { type: 'string' },
                                                category: { type: 'string' },
                                                questions: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            text: { type: 'string' },
                                                            type: { type: 'string' },
                                                            options: {
                                                                type: 'array',
                                                                items: { type: 'string' },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            404: {
                                description: 'Survey not found',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    put: {
                        tags: ['Surveys'],
                        summary: 'Update a survey',
                        description: 'Update a survey by its ID.',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: { type: 'integer' },
                                description: 'ID of the survey to update',
                            },
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            title: { type: 'string' },
                                            description: { type: 'string' },
                                            category: { type: 'string' },
                                            questions: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        text: { type: 'string' },
                                                        type: { type: 'string' },
                                                        options: {
                                                            type: 'array',
                                                            items: { type: 'string' },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        required: ['title', 'description', 'category', 'questions'],
                                    },
                                },
                            },
                        },
                        responses: {
                            200: {
                                description: 'The updated survey',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                title: { type: 'string' },
                                                description: { type: 'string' },
                                                category: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            404: {
                                description: 'Survey not found',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    delete: {
                        tags: ['Surveys'],
                        summary: 'Delete a survey',
                        description: 'Delete a survey by its ID.',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: { type: 'integer' },
                                description: 'ID of the survey to delete',
                            },
                        ],
                        responses: {
                            200: {
                                description: 'Survey deleted successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            404: {
                                description: 'Survey not found',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/surveys/{surveyId}/responses': {
                    post: {
                        tags: ['Responses'],
                        summary: 'Submit a survey response',
                        description: 'Add a new response to a survey.',
                        parameters: [
                            {
                                name: 'surveyId',
                                in: 'path',
                                required: true,
                                schema: { type: 'integer' },
                                description: 'ID of the survey to respond to',
                            },
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            responses: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        questionId: { type: 'integer' },
                                                        answer: { type: 'string' }, // Adjust based on the expected answer format
                                                    },
                                                },
                                            },
                                        },
                                        required: ['responses'],
                                    },
                                },
                            },
                        },
                        responses: {
                            201: {
                                description: 'Response submitted successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                            404: {
                                description: 'Survey not found',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/surveys/{surveyId}/metrics': {
                    get: {
                        tags: ['Metrics'],
                        summary: 'Get survey metrics',
                        description: 'Retrieve metrics for a specific survey.',
                        parameters: [
                            {
                                name: 'surveyId',
                                in: 'path',
                                required: true,
                                schema: { type: 'integer' },
                                description: 'ID of the survey to retrieve metrics for',
                            },
                        ],
                        responses: {
                            200: {
                                description: 'Survey metrics',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                surveyId: { type: 'integer' },
                                                responseCount: { type: 'integer' },
                                                averageRating: { type: 'number' },
                                                // Add additional metrics as needed
                                            },
                                        },
                                    },
                                },
                            },
                            404: {
                                description: 'Survey not found',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return spec as Record<string, unknown>; // Cast to Record<string, unknown>
};