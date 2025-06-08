import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    const { token } = req.headers;
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Please login again.' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
        }

        return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
    }
}

export default authUser;
