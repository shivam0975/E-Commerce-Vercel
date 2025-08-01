import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  await dbConnect();

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required' });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(409).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = signToken({ _id: user._id, email: user.email, isAdmin: user.isAdmin });

  res.status(201).json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
  });
}