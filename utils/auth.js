import jwt from 'jsonwebtoken';

export async function verifyUserFromReq(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;  // e.g. {_id, isAdmin, ...}
  } catch (error) {
    return null;
  }
}

export function authMiddleware(handler) {
  return async (req, res) => {
    // Skip auth for GET requests to /api/product (public)
    if (req.method === 'GET' && req.url.startsWith('/api/product')) {
      return handler(req, res);
    }

    // For other methods, verify token
    const user = await verifyUserFromReq(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    req.user = user; // Attach user info to request
    return handler(req, res);
  };
}
