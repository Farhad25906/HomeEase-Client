# 🏠 HomeEase Client - Home Service Booking Platform

A modern, responsive React application for HomeEase, a platform connecting homeowners with professional service providers. Built with React, Vite, Tailwind CSS, and Material UI.

## 🌐 Live URL

- **Frontend:** [https://home-ease-client-493v.vercel.app](https://home-ease-client-493v.vercel.app)
- **Backend API:** [https://home-ease-server.vercel.app](https://home-ease-server.vercel.app)

---

## 🎯 Overview

HomeEase Client is a feature-rich frontend application that facilitates seamless booking of home services. It features role-based dashboards for Users (Service Receivers), Service Providers, and Admins, offering a complete ecosystem for home maintenance needs.

### Key Highlights

- ✅ **Modern UI/UX** - Built with Tailwind CSS and Material UI components
- ✅ **Role-Based Dashboards** - Dedicated interfaces for Users, Providers, and Admins
- ✅ **Secure Authentication** - Powered by Firebase Authentication
- ✅ **Secure Payments** - Integreted with Stripe for safe transactions
- ✅ **Real-Time Data** - TanStack Query for efficient data fetching and caching
- ✅ **Responsive Design** - Fully responsive layout for all devices
- ✅ **Interactive Animations** - smooth user experience with Framer Motion and Lottie

---

## 🚀 Features

### 🔐 Authentication

- **Sign In/Sign Up** - Secure email/password and social login options
- **Role Selection** - Choose to join as a Service Provider or Service Receiver
- **Profile Management** - Manage personal details and preferences

### 👤 Service Receiver (User) Features

- **Browse Services** - Explore a wide range of home services with filtering and search
- **Book Services** - Easy booking process with date and time selection
- **Manage Bookings** - View status of current and past bookings
- **Secure Payments** - Pay for services securely via Stripe
- **Reviews** - Rate and review service providers

### 🛠️ Service Provider Features

- **Service Listing** - Add and manage services offered (Description, Price, Categories)
- **Booking Management** - Accept or reject booking requests
- **Earnings Dashboard** - Track detailed earnings and request withdrawals
- **My Services** - Edit and update service details
- **Withdrawal** - Request payouts to your bank account

### 👨‍💼 Admin Features

- **Dashboard Overview** - Platform-wide statistics and metrics
- **User Management** - Manage all users and their roles
- **Service Management** - Monitor and moderate service listings
- **Category Management** - Add, edit, or remove service categories
- **Withdrawal Management** - Approve or reject provider withdrawal requests

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React** | UI framework |
| **Vite** | Build tool |
| **Tailwind CSS** | Utility-first CSS framework |
| **Material UI** | UI Component library |
| **TanStack Query** | Data fetching and state management |
| **React Router** | Routing |
| **Firebase** | Authentication |
| **Stripe.js** | Payment processing |
| **Axios** | HTTP client |
| **Lottie React** | Animations |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:9000
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_Payment_Gateway_PK=your_stripe_public_key
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Farhad25906/HomeEase-Client.git
   cd HomeEase-Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` and add your configuration keys.

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

The app will start on `http://localhost:5173`

---

## 👨‍💻 Author

**Farhad Hossen**
- GitHub: [@Farhad25906](https://github.com/Farhad25906)
- Email: farhadhossen2590@gmail.com

---

## 📄 License

This project is licensed under the ISC License.