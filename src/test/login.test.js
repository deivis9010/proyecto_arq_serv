const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');

describe('Login API with JWT', () => {
    let testUser;
    
    beforeEach(async () => {
        // Limpiar la base de datos antes de cada test
        await User.deleteMany({});
        
        // Crear un usuario de prueba
        testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'testPassword123'
        });
    });

    afterEach(async () => {
        // Limpiar después de cada test
        await User.deleteMany({});
    });

    describe('POST /api/login', () => {
        it('should login successfully and return JWT token', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'testPassword123'
            };

            const res = await request(app)
                .post('/api/login')
                .send(loginData);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('expiresIn');
            
            // Verificar datos del usuario
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user.name).toBe(testUser.name);
            expect(res.body.user).not.toHaveProperty('password'); // No debe incluir contraseña
            
            // Verificar que el token sea una string válida
            expect(typeof res.body.token).toBe('string');
            expect(res.body.token.length).toBeGreaterThan(0);
            
            // Verificar expiración
            expect(res.body.expiresIn).toBe('1d');
        });

        it('should return 401 for invalid email', async () => {
            const loginData = {
                email: 'wrong@example.com',
                password: 'testPassword123'
            };

            const res = await request(app)
                .post('/api/login')
                .send(loginData);

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).not.toHaveProperty('token');
        });

        it('should return 401 for invalid password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongPassword'
            };

            const res = await request(app)
                .post('/api/login')
                .send(loginData);

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
            expect(res.body).not.toHaveProperty('token');
        });

        it('should return 400 for missing email', async () => {
            const loginData = {
                password: 'testPassword123'
            };

            const res = await request(app)
                .post('/api/login')
                .send(loginData);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Required fields missing');
            expect(res.body).not.toHaveProperty('token');
        });

        it('should return 400 for missing password', async () => {
            const loginData = {
                email: 'test@example.com'
            };

            const res = await request(app)
                .post('/api/login')
                .send(loginData);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Required fields missing');
            expect(res.body).not.toHaveProperty('token');
        });
    });

    describe('JWT Token Usage', () => {
        let validToken;

        beforeEach(async () => {
            // Hacer login para obtener un token válido
            const loginRes = await request(app)
                .post('/api/login')
                .send({
                    email: 'test@example.com',
                    password: 'testPassword123'
                });
            
            validToken = loginRes.body.token;
        });

      

        it('should verify token has correct JWT format', async () => {
            expect(validToken).toBeDefined();
            expect(typeof validToken).toBe('string');
            expect(validToken.length).toBeGreaterThan(0);
            
            // Verificar que el token tiene el formato JWT (3 partes separadas por puntos)
            const tokenParts = validToken.split('.');
            expect(tokenParts).toHaveLength(3);
        });
    });
});
