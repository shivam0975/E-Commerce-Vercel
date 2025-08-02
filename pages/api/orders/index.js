import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import { authMiddleware } from '../../../utils/auth';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }

    try {
      const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({ orders });  // ✅ wrap in object
    } catch (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }
  }

  else if (req.method === 'POST') {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    try {
      const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: false,
        isDelivered: false
      });

      return res.status(201).json(order);
    } catch (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ message: 'Failed to create order' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
