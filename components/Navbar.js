import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-indigo-600">
        Shivam's E-Shop
      </Link>
      <div className="flex items-center space-x-6">
        <Link href="/cart">
          <div className="relative cursor-pointer">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9M17 13l2 9M6 21h12" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
        {user ? (
          <>
            {user.isAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-indigo-600">
                Admin
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
