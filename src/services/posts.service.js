const HttpError = require('../models/error.model');
const Post = require('../models/post.model');


const getAllPosts = async () => {
    
    const posts = await Post.find();
    return posts;
};

const getPostById = async (postId) => {
    
    const post = await Post.findById(postId);
    if (!post) {
        throw new HttpError('404', 'Resource not found');
    }
    return post;
};

const createPost = async (postData) => {
    
    const post = await Post.create(postData);
    return post;
};

const updatePostPartially = async (postId, updateData) => {
    
    const post = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    return post;
};

const deletePost = async (postId) => {
    
    const deletedPost = await Post.findByIdAndDelete(postId);
    return deletedPost; 
};



module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostPartially,
    deletePost
};