const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    try {

        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(500).json({
                success: false,
                message: 'token not found',
            });
        }

        try {

            const userProfile = jwt.verify(token, process.env.JWT_SECRET);
            req.user = userProfile;
            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'token is invalid',
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = auth;
