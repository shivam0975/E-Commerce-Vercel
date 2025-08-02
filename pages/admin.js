import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    countInStock: ''
  });

  const token = user?.token || '';

  useEffect(() => {
    if (user === undefined) return;
    if (!user || !user.isAdmin) {
      router.push('/');
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
    setLoadingProducts(false);
  }

  async function fetchOrders() {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
    setLoadingOrders(false);
  }

  async function createProduct(e) {
    e.preventDefault();
    setError('');

    const { name, description, price, image, countInStock } = newProduct;

    if (!name || !description || !price || !image || !countInStock) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          image,
          countInStock: Number(countInStock)
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create product');
      }
      setNewProduct({ name: '', description: '', price: '', image: '', countInStock: '' });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', // optional, but useful
        Authorization: `Bearer ${token}`    // make sure `token` is defined
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }

    await fetchProducts(); // ensure this is an `async` function
  } catch (err) {
    console.error('Delete error:', err.message);
    setError(err.message);
  }
}


  async function markOrderPaid(id) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'markPaid' })
      });
      if (!res.ok) throw new Error('Failed to mark paid');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  async function markOrderDelivered(id) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'markDelivered' })
      });
      if (!res.ok) throw new Error('Failed to mark delivered');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        {error && <p className="text-red-600 text-center">{error}</p>}

        <section>
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
          <form
            onSubmit={createProduct}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          >
            <input
              type="text"
              placeholder="Name"
              className="border rounded p-2"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="border rounded p-2"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              min="0"
              className="border rounded p-2"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="border rounded p-2"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
            <input
              type="number"
              placeholder="Count in Stock"
              min="0"
              className="border rounded p-2"
              value={newProduct.countInStock}
              onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 col-span-full md:col-auto mt-2"
            >
              Add Product
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Products List</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">Name</th>
                  <th className="p-2 border border-gray-300">Price</th>
                  <th className="p-2 border border-gray-300">Stock</th>
                  <th className="p-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} className="text-center">
                    <td className="p-2 border border-gray-300">{prod.name}</td>
                    <td className="p-2 border border-gray-300">${prod.price.toFixed(2)}</td>
                    <td className="p-2 border border-gray-300">{prod.countInStock}</td>
                    <td className="p-2 border border-gray-300">
                      <button
                        onClick={() => deleteProduct(prod._id)}
                        className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">Order ID</th>
                  <th className="p-2 border border-gray-300">User</th>
                  <th className="p-2 border border-gray-300">Total</th>
                  <th className="p-2 border border-gray-300">Paid</th>
                  <th className="p-2 border border-gray-300">Delivered</th>
                  <th className="p-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2 border border-gray-300">{order._id.slice(-6)}</td>
                    <td className="p-2 border border-gray-300">{order.user?.name}</td>
                    <td className="p-2 border border-gray-300">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-2 border border-gray-300">
                      {order.isPaid ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {order.isDelivered ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                    <td className="p-2 border border-gray-300 space-x-2">
                      {!order.isPaid && (
                        <button
                          onClick={() => markOrderPaid(order._id)}
                          className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 text-white"
                        >
                          Mark Paid
                        </button>
                      )}
                      {!order.isDelivered && (
                        <button
                          onClick={() => markOrderDelivered(order._id)}
                          className="bg-green-600 px-2 py-1 rounded hover:bg-green-700 text-white"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
