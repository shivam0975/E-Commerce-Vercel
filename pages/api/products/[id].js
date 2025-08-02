import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { authMiddleware } from '../../../utils/auth';

async function handler(req, res) {
  try {
    await dbConnect();
    const { id } = req.query;

    switch (req.method) {
      case 'GET': {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json(product);
      }

      case 'PUT': {
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).json({ message: 'Admin resource. Access denied.' });
        }

        const { name, description, price, image, countInStock } = req.body;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.image = image ?? product.image;
        product.countInStock = countInStock ?? product.countInStock;

        await product.save();
        return res.status(200).json(product);
      }

      case 'DELETE': {
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).json({ message: 'Admin resource. Access denied.' });
        }

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.deleteOne();
        return res.status(200).json({ message: 'Product deleted successfully' });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
}

export default authMiddleware(handler);
