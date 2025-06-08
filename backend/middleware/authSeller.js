import jwt from 'jsonwebtoken';

// Seller authentication middleware
const authSeller = async (req, res, next) => {
  try {
    // Get token from custom header 'dtoken'
    const token = req.headers.dtoken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Please login again.' });
    }

    // Verify token with secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach seller ID to req for further use in controllers
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error('authSeller error:', error);
    res.status(401).json({ success: false, message: 'Invalid token or session expired.' });
  }
};

export default authSeller;
