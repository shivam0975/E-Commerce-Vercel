import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import { authMiddleware } from '../../../utils/auth';

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (req.method === 'GET') {
    // user can view own order, admin can view any
    if (order.user._id.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    return res.status(200).json(order);
  }
  else if(req.method === 'PUT') {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }
    const { action } = req.body;
    if(action === 'markPaid') {
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
      return res.status(200).json(order);
    }
    else if(action === 'markDelivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();
      return res.status(200).json(order);
    }
    return res.status(400).json({ message: 'Invalid action' });
  }
  else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);