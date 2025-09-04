const loginService = require('../services/login.service');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await loginService.login(email, password);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error logging in:', error);
        next(error);
    }
};

module.exports = {
    login
};  