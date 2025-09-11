const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');

describe('Users API', () => {
    let userId;

    // Limpiar la base de datos antes de cada test
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Limpiar la base de datos después de cada test para evitar datos residuales
    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/users', () => {
        it('should create a new user with valid data', async () => {
            const newUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'testPassword123'
            };

            const res = await request(app)
                .post('/api/users')
                .send(newUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe(newUser.name);
            expect(res.body.email).toBe(newUser.email);
            expect(res.body).not.toHaveProperty('password'); // Password should be hidden
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');

            userId = res.body.id;
        });

        it('should return 409 error for duplicate email', async () => {
            const userData = {
                name: 'Test User',
                email: 'duplicate@example.com',
                password: 'testPassword123'
            };

            // Crear el primer usuario
            await request(app)
                .post('/api/users')
                .send(userData);

            // Intentar crear otro usuario con el mismo email
            const res = await request(app)
                .post('/api/users')
                .send({
                    name: 'Another User',
                    email: 'duplicate@example.com',
                    password: 'anotherPassword123'
                });

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Resource already exists');
            expect(res.body.error).toBe('DUPLICATE_EMAIL');
        });

        it('should return 400 error for missing required fields', async () => {
            const incompleteUser = {
                name: 'Test User'
                // Falta email y password
            };

            const res = await request(app)
                .post('/api/users')
                .send(incompleteUser);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation error');
        });

        it('should return 400 error for invalid email format', async () => {
            const invalidUser = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'testPassword123'
            };

            const res = await request(app)
                .post('/api/users')
                .send(invalidUser);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation error');
        });
    });

    describe('GET /api/users', () => {
        beforeEach(async () => {
            // Crear algunos usuarios de prueba
            await User.create([
                {
                    name: 'User 1',
                    email: 'user1@example.com',
                    password: 'password123'
                },
                {
                    name: 'User 2',
                    email: 'user2@example.com',
                    password: 'password123'
                }
            ]);
        });

        it('should get all users', async () => {
            const res = await request(app)
                .get('/api/users');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
            
            // Verificar que las contraseñas no se exponen
            res.body.forEach(user => {
                expect(user).not.toHaveProperty('password');
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('email');
            });
        });
    });
});
