import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import User from '../../../models/User';  // MUST import User model for populate
import { authMiddleware } from '../../../utils/auth';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }

    try {
      const orders = await Order.find({})
        .populate('user', 'name email')  // needs User model imported
        .sort({ createdAt: -1 });

      return res.status(200).json({ orders });
    } catch (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }
  } else if (req.method === 'POST') {
    // ... your order creation POST logic ...
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
