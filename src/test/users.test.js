const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');

describe('Users API', () => {
    let userId;
    let authToken;
    let testUser;

    // Limpiar la base de datos antes de cada test
    beforeEach(async () => {
        await User.deleteMany({});
        
        // Crear un usuario de prueba y obtener token de autenticación para las rutas protegidas
        testUser = await User.create({
            name: 'Auth Test User',
            email: 'authtest@example.com',
            password: 'testPassword123',
            active: true
        });

        // Hacer login para obtener el token
        const loginRes = await request(app)
            .post('/api/login')
            .send({
                email: 'authtest@example.com',
                password: 'testPassword123'
            });

        authToken = loginRes.body.token;
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
                .set('Authorization', `Bearer ${authToken}`)
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
                .set('Authorization', `Bearer ${authToken}`)
                .send(userData);

            // Intentar crear otro usuario con el mismo email
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
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
                .set('Authorization', `Bearer ${authToken}`)
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
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidUser);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation error');
        });
    });

    describe('GET /api/users', () => {
        beforeEach(async () => {
            // No limpiar aquí, ya que necesitamos el usuario de auth del beforeEach principal
            // Solo crear los usuarios de prueba adicionales
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
                .get('/api/users')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(3); // 1 usuario de auth + 2 usuarios de prueba = 3 total
            
            // Verificar que las contraseñas no se exponen
            res.body.forEach(user => {
                expect(user).not.toHaveProperty('password');
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('email');
            });
        });

        it('should return 401 for missing authorization token', async () => {
            const res = await request(app)
                .get('/api/users');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Access token required');
        });
    });
});
