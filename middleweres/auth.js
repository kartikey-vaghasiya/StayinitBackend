const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    try {
        // Step 1: Check for token in the cookie or headers or body
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found',
                data: {},
            });
        }

        // Step 2: Verify Token
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);

            // Step 3: Attach User in req
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error during verifying Token',
                data: {},
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal middleware error',
            data: {},
        });
    }
};

module.exports = auth;
