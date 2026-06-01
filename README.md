<div align="center">
  <h1>🎨 Artwork E-Commerce Platform</h1>
  <p>
    A comprehensive, full-stack e-commerce ecosystem designed exclusively for discovering, showcasing, and purchasing beautiful artwork. Built for seamless user experiences, secure transactions, and powerful artist showcases.
  </p>
</div>

<div align="center">

[![Node JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express JS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

<br />

</div>

---

## ✨ Why I Built This

> **The digital art space required a platform as stunning as the art itself.**  
> I engineered this system from the ground up to guarantee a zero-friction shopping experience, highly secure administration, and visual excellence. Every piece of the architecture was chosen to ensure blazing-fast load times and secure payments.

---

## 🌟 Key Features

| 💎 Feature                    | 📖 What It Means                                                                                                    |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| 🛡 **Secure Transactions**    | Integrated payment gateways (Stripe) to process orders safely and reliably.                                         |
| 🔍 **Product Discovery**      | Browse artworks with advanced filtering, categorization, and lightning-fast search algorithms.                      |
| 👤 **User Profiles**          | Complete user authentication to manage wishlists, order history, and personal details.                              |
| 📊 **Admin Dashboard**        | Powerful tools to manage inventory, track live orders, and view sales analytics in real-time.                       |

---

## 🏗 Project Architecture

This repository is structured as a monorepo containing the robust core applications. Click below to expand details about each core component:

<details>
<summary><b>1. 🖥️ backend (Node.js & Express)</b></summary>
<br>
The central nervous system of the platform.
<ul>
<li><b>Authentication:</b> Secure user sessions and JWT token management.</li>
<li><b>Database:</b> MongoDB integration for storing users, orders, and product data.</li>
<li><b>Payments:</b> Stripe integration for handling checkouts securely.</li>
<li><b>API:</b> RESTful endpoints for catalog management, shopping cart logic, and analytics.</li>
</ul>
</details>

<details>
<summary><b>2. 🌐 frontend (React & Vite)</b></summary>
<br>
The public-facing portal for shoppers.
<ul>
<li><b>Features:</b> Product discovery, seamless checkout flow, and user profile management.</li>
<li><b>Design:</b> Immersive, responsive design optimized for desktop and mobile displays.</li>
<li><b>Performance:</b> Optimized state management and lazy loading for instantaneous interactions.</li>
</ul>
</details>

---

## ⚙️ Configuration & Environment

To run this project locally, you need to configure Environment Variables in `.env` files for each container. Expand to see required keys.

<details>
<summary><b>Backend (<code>/backend/.env</code>)</b></summary>
<br>

| Variable                  | Description                               |
| :------------------------ | :---------------------------------------- |
| `PORT`                    | Server port (e.g., 5000)                  |
| `MONGO_URI`               | MongoDB connection string                 |
| `JWT_SECRET`              | Secret for securing user tokens           |
| `STRIPE_SECRET_KEY`       | Secret key for processing payments        |
| `FRONTEND_URL`            | CORS allowed origin for the frontend app  |

</details>

<details>
<summary><b>Frontend (<code>/frontend/.env</code>)</b></summary>
<br>

- `VITE_API_URL`: URL of the deployed backend used for all API calls.
- `VITE_STRIPE_PUBLIC_KEY`: Public key for the Stripe Checkout UI.

</details>

---

## 🚀 Getting Started

1. **Install Dependencies:**  
   Run `npm run install:all` in the root directory to install both frontend and backend dependencies.
2. **Setup Environments:**  
   Configure the `.env` files using the reference above.
3. **Run Concurrently:**  
   Start both servers with a single command: `npm run dev` in the root directory.
