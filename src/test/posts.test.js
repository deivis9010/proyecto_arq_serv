const request = require('supertest');
const app = require('../app');
const Post = require('../models/post.model');

describe('Posts API', () => {
    let postId;

    // Limpiar la base de datos después de cada test para evitar datos residuales
    afterEach(async () => {
        await Post.deleteMany({});
    });

   

    describe('POST /api/posts', () => {
        it('should create a new post with valid data', async () => {
            const newPost = {
                title: 'Test Post Title',
                text: 'This is a test post content that is longer than 5 characters',
                author: 'Test Author'
            };

            const res = await request(app)
                .post('/api/posts')
                .send(newPost);

            expect(res.status).toBe(201);
            
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe(newPost.title);
            expect(res.body.text).toBe(newPost.text);
            expect(res.body.author).toBe(newPost.author);
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');

            postId = res.body.id;
        });

        it('should send a 400 error for missing required fields', async () => {
            const newPost = {
                title: 'Test Post Title',                
                author: 'Test Author'
            };

            const res = await request(app)
                .post('/api/posts')
                .send(newPost);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Required fields missing');

            
        });

        it('should return 400 for invalid data (title too short)', async () => {
            const invalidPost = {
                title: 'Hi', 
                text: 'Valid text content here',
                author: 'Test Author'
            };

            const res = await request(app)
                .post('/api/posts')
                .send(invalidPost);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toMatch(/validation/i);
        });

        
    });

    describe('GET /api/posts', () => {
        beforeEach(async () => {
            await Post.deleteMany({});
            await Post.create([
                {
                    title: 'First Post',
                    text: 'Content of first post',
                    author: 'Author 1'
                },
                {
                    title: 'Second Post',
                    text: 'Content of second post',
                    author: 'Author 2'
                }
            ]);
        });

        it('should get all posts', async () => {
            const res = await request(app).get('/api/posts');

            expect(res.status).toBe(200);
            
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('title');
            expect(res.body[0]).toHaveProperty('text');
            expect(res.body[0]).toHaveProperty('author');
            expect(res.body[0]).toHaveProperty('createdAt');
            expect(res.body[0]).toHaveProperty('updatedAt');
        });

       
    });

    describe('GET /api/posts/:id', () => {
        let testPost;

        beforeEach(async () => {
            testPost = await Post.create({
                title: 'Test Post for Get',
                text: 'Content for testing get by id',
                author: 'Test Author'
            });
        });

        it('should get a post by valid ID', async () => {
            const res = await request(app).get(`/api/posts/${testPost.id}`);

            expect(res.status).toBe(200);            
            expect(res.body.id).toBe(testPost.id.toString());
        });

        it('should return 404 for non-existent ID', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const res = await request(app).get(`/api/posts/${fakeId}`);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Resource not found');
        });

        
    });

    describe('PATCH /api/posts/:id', () => {
        let testPost;

        beforeEach(async () => {
            testPost = await Post.create({
                title: 'Original Title',
                text: 'Original content',
                author: 'Original Author'
            });
        });

        it('should update a post with valid data', async () => {
            const updateData = {
                title: 'Updated Title',
                text: 'Updated content here'
            };

            const res = await request(app)
                .patch(`/api/posts/${testPost.id}`)
                .send(updateData);

            expect(res.status).toBe(200);
          
            expect(res.body.title).toBe(updateData.title);
            expect(res.body.text).toBe(updateData.text);
            expect(res.body.author).toBe('Original Author'); 
        });
    });

    describe('DELETE /api/posts/:id', () => {
        let testPost;

        beforeEach(async () => {
            testPost = await Post.create({
                title: 'Post to Delete',
                text: 'This post will be deleted',
                author: 'Test Author'
            });
        });

        it('should delete a post by ID', async () => {
            const res = await request(app).delete(`/api/posts/${testPost.id}`);

            expect(res.status).toBe(204);         

            const deletedPost = await Post.findById(testPost.id);
            expect(deletedPost).toBeNull();
        });
    });
});
