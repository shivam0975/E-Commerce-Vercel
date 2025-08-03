import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { data: products, error } = useSWR('/api/products', fetcher);
  const { addToCart } = useCart();

  if (error) return <div className="p-4">Failed to load</div>;
  if (!products) return <div className="p-4">Loading...</div>;

  return (
    <>
      <Navbar />
      <Head>
        <title>Shivam's E-Shop</title>
      </Head>
      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded shadow">
            <Link href={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded cursor-pointer"
              />
            </Link>
            <div className="mt-2">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <button
                disabled={product.countInStock === 0}
                onClick={() => addToCart(product, 1)}
                className={`mt-2 w-full px-3 py-1 rounded ${
                  product.countInStock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
