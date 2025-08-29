const postsService = require('../services/posts.service');



const createPost = async (req, res) => {
    try {
        const { title, text, author } = req.body;
        
        
        if (!title || !text || !author) {
            return res.status(400).json({                
                message: 'Título, texto y autor son requeridos'
            });
        }
        
        const post = await postsService.createPost({ title, text, author });        
         res.status(201).json(post);

    } catch (error) {
        console.error('Error en createPost:', error);
        const statusCode = error.message.includes('validation') ? 400 : 500;
        res.status(statusCode).json({
            message: error.message
        });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await postsService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error en getAllPosts:', error);
        res.status(500).json({
            message: error.message
        });
    }
};

const getPostById = async (req, res) => {
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
        console.error('Error en getPostById:', error);
        res.status(500).json({
            message: error.message
        });
    }
};

const updatePostPartially = async (req, res) => {
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
        console.error('Error en updatePostPartially:', error);
        res.status(500).json({
            message: error.message
        });
    }
};

const deletePost = async (req, res) => {
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
        console.error('Error en deletePost:', error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostPartially,
    deletePost
};
