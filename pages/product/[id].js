import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { data: product, error } = useSWR(id ? `/api/products/${id}` : null, fetcher);
  const [qty, setQty] = useState(1);

  if (error) return <div className="p-4">Failed to load</div>;
  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded object-cover max-h-[400px]"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-gray-700">{product.description}</p>
          <p className="mt-4 text-xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="mt-2">
            Status:{' '}
            {product.countInStock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>
          {product.countInStock > 0 && (
            <>
              <div className="mt-4">
                <label htmlFor="qty" className="mr-2 font-semibold">
                  Quantity:
                </label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max={product.countInStock}
                  value={qty}
                  onChange={(e) => setQty(Math.min(Math.max(1, Number(e.target.value)), product.countInStock))}
                  className="border px-2 py-1 w-16 rounded"
                />
              </div>
              <button
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => {
                  addToCart(product, qty);
                  router.push('/cart');
                }}
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}