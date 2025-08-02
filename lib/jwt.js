import jwt from 'jsonwebtoken';

export function signToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
