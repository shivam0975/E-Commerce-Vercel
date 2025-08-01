import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { authMiddleware } from '../../../utils/auth';

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(product);
  }

  else if (req.method === 'PUT') {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }

    const { name, description, price, image, countInStock } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price != null ? price : product.price;
    product.image = image || product.image;
    product.countInStock = countInStock != null ? countInStock : product.countInStock;

    await product.save();
    return res.status(200).json(product);
  }

  else if (req.method === 'DELETE') {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    return res.status(204).end();
  }

  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
