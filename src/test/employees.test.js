const request = require('supertest');
const app = require('../app');

describe('Employee API', () => {
it('GET /api/employees - Todos los empleados', async () => {
        const res = await request(app).get('/api/employees');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('GET /api/employees/oldest - retorna el empleado mas viejo', async () => {
        const res = await request(app).get('/api/employees/oldest');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('age');
    });

    it('POST /api/employees - crear nuevo empleado', async () => {
        const newEmployee = {
            name: 'Dennis',
            age: 30,
            phone: {
                personal: '729-874-1478',
                work: '145-888-430258'
            },
            privileges: 'user',
            favorites: {
                artist: 'Artist Name',
                food: 'Pizza'
            },
            finished: [],
            badges: [],
            points: []
        };
        const res = await request(app).post('/api/employees').send(newEmployee);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(newEmployee);
    });

    it('GET /api/employees/:name - retorna empleado por nombre', async () => {
        const res = await request(app).get('/api/employees/Sue');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Sue');
    });
});
