const HttpError = require('../models/error.model');
const Post = require('../models/post.model');


const getAllPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message);
    }
};

const getPostById = async (postId) => {
    try {
        const post = await Post.findById(postId);
       if (!post) {
           throw new HttpError('404', 'Post not found');
       }
        return post;
    } catch (error) {
        throw new HttpError('404', 'Error fetching post: ' + error.message);
    }
};

const createPost = async (postData) => {

    try {
        const post = await Post.create(postData);
        return post;
    } catch (error) {
        throw new Error('Error creating post: ' + error.message);
    }
   
};

const updatePostPartially = async (postId, updateData) => {
    try {
        const post = await Post.findByIdAndUpdate(postId, updateData, { new: true });
        return post;
    } catch (error) {
        throw new Error('Error updating post: ' + error.message);
    }
};

const deletePost = async (postId) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        return deletedPost; 
    } catch (error) {
        throw new Error('Error deleting post: ' + error.message);
    }
};



module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostPartially,
    deletePost
};