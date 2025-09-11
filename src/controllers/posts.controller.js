const postsService = require('../services/posts.service');



const createPost = async (req, res, next) => {
    try {
        const { title, text, author } = req.body;
        
        if (!title || !text || !author) {
            return res.status(400).json({                
                message: 'Required fields missing'
            });
        }
        
        const post = await postsService.createPost({ title, text, author });        
        res.status(201).json(post);

    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

const getAllPosts = async (req, res, next) => {
    try {
        const posts = await postsService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await postsService.getPostById(id);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        res.status(200).json(post);
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

const updatePostPartially = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, text, author } = req.body;

        const updatedPost = await postsService.updatePostPartially(id, { title, text, author });
        if (!updatedPost) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await postsService.deletePost(id);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        res.status(204).send();
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostPartially,
    deletePost
};
