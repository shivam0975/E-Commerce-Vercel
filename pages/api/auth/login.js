import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken({ _id: user._id, email: user.email, isAdmin: user.isAdmin });

  res.status(200).json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
  });
}
