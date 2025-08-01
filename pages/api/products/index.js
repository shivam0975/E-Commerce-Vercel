import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { authMiddleware } from '../../../utils/auth';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const products = await Product.find({});
    return res.status(200).json(products);
  }

  else if (req.method === 'POST') {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }

    const { name, description, price, image, countInStock } = req.body;
    if (!name || !description || price == null || !image || countInStock == null) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const product = await Product.create({ name, description, price, image, countInStock });
    return res.status(201).json(product);
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
