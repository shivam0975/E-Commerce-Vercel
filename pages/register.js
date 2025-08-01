import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  async function submitHandler(e) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Failed to register');
    } else {
      login(data.user);
      router.push('/');
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6 bg-white mt-8 rounded shadow">
        <h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>
        {error && <p className="bg-red-200 text-red-800 p-2 rounded mb-4">{error}</p>}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            required
            type="text"
            placeholder="Name"
            className="border rounded px-3 py-2"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" type="submit">
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </main>
    </>
  );
}