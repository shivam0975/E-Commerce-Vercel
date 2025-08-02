
# 🛒 E-Commerce Store (Next.js + MongoDB + Vercel)

A modern full-stack e-commerce platform built using **Next.js**, **MongoDB**, **Tailwind CSS**, and deployed on **Vercel**. Features include user authentication, admin dashboard, cart management, and order handling.

---

## 📁 Project Structure

```
ecommerce-store/
│
├── models/               # Mongoose models (User, Product, Order)
├── pages/
│   ├── index.js          # Homepage
│   ├── login.js
│   ├── register.js
│   ├── cart.js
│   ├── admin.js
│   ├── product/[id].js   # Product Details Page
│   └── api/
│       ├── users/        # Auth, Register, Login
│       ├── products/     # CRUD operations for products
│       ├── orders/       # Order APIs
│       └── auth/         # JWT handling
├── components/           # Reusable React components
├── context/              # React context for Auth, Cart
├── lib/                  # DB connection, token handling
├── utils/                # Auth middleware and helpers
├── styles/               # Tailwind and global CSS
├── public/               # Static assets
├── tailwind.config.js    # Tailwind setup
├── vercel.json           # Vercel config
├── package.json
└── README.md
```

---

## ⚙️ Getting Started Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivam0975/E-Commerce-Vercel.git
   cd E-Commerce-Vercel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Visit your app**
   Open [http://localhost:3000](http://localhost:3000)

---

## 📜 License

MIT License © 2025 Shivam Tripathi

---

## 🙋‍♂️ Support

For issues, bugs, or feature requests, open an issue [here](https://github.com/shivam0975/E-Commerce-Vercel/issues).
