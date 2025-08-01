import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const checkoutHandler = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            Your cart is empty. <Link href="/">Go Shopping</Link>
          </div>
        ) : (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className="flex items-center border-b py-4 gap-4">
                  <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
                  <Link href={`/product/${item._id}`} className="font-semibold flex-grow">
                    {item.name}
                  </Link>
                  <input
                    type="number"
                    min="1"
                    max={item.countInStock}
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item._id, Math.min(Math.max(1, Number(e.target.value)), item.countInStock))
                    }
                    className="border rounded px-2 py-1 w-16"
                  />
                  <p className="w-20">${(item.price * item.qty).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <p className="text-xl font-semibold">Total: ${cartTotal.toFixed(2)}</p>
              <button
                onClick={checkoutHandler}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}