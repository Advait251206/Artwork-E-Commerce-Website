# Artwork E-Commerce Platform

A comprehensive, full-stack e-commerce platform designed exclusively for discovering, showcasing, and purchasing beautiful artwork. This project features a robust backend architecture paired with an intuitive frontend interface, providing a seamless shopping experience for art enthusiasts and a powerful showcase for artists.

## 🚀 Features

- **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices.
- **Product Discovery**: Browse artworks with filtering, categorization, and search.
- **Secure Transactions**: Fully integrated checkout process.
- **User Authentication**: Sign up, log in, and manage user profiles.
- **Admin Dashboard**: Manage inventory, track orders, and view sales analytics.

## 🛠️ Tech Stack

This project is separated into a `frontend` and a `backend` application.

- **Frontend**: Built with modern web technologies (React/Next.js/etc.) focusing on performance and SEO.
- **Backend**: Scalable API server handling business logic, authentication, and database operations.

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Advait251206/Artwork-E-Commerce-Website.git
   cd Artwork-E-Commerce-Website
   ```

2. **Install all dependencies**
   This project uses a root `package.json` to manage both environments.
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   - Navigate to the `backend` folder and create a `.env` file based on `.env.example`.
   - Navigate to the `frontend` folder and create a `.env` file based on `.env.example`.

### Running the Application

You can start both the frontend and backend servers simultaneously from the root directory:

```bash
npm run dev
```

Alternatively, you can run them individually by navigating to their respective directories:
- **Backend:** `cd backend && npm run dev`
- **Frontend:** `cd frontend && npm run dev`

## 📄 License

This project is licensed under the MIT License.
