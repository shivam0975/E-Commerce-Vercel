import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const token = user?.token || '';

  useEffect(() => {
    setMounted(true);

    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!mounted) {
    return null;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping fields');
      return;
    }
    setError('');
    setLoading(true);

    const orderItems = cartItems.map((item) => ({
      product: item._id,
      qty: item.qty,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: {
            address,
            city,
            postalCode,
            country,
          },
          paymentMethod,
          itemsPrice: cartTotal,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: cartTotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      router.push('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6 bg-white mt-8 rounded shadow">
        <h1 className="text-3xl font-semibold mb-6 text-center">Checkout</h1>
        {error && <p className="bg-red-200 text-red-800 p-2 rounded mb-4">{error}</p>}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            type="text"
            placeholder="Address"
            className="border rounded px-3 py-2"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            type="text"
            placeholder="City"
            className="border rounded px-3 py-2"
          />
          <input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            type="text"
            placeholder="Postal Code"
            className="border rounded px-3 py-2"
          />
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            type="text"
            placeholder="Country"
            className="border rounded px-3 py-2"
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="PayPal">PayPal</option>
            <option value="Credit Card">Credit Card (mock)</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </main>
    </>
  );
}
