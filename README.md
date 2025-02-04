<div align="center">

# 🏪 FastPiks - The Ultimate E-Commerce Platform

</div>

FastPiks is a dynamic and feature-rich e-commerce platform built with **Next.js**, **ShadCN UI**, and **Tailwind CSS**. It offers a seamless shopping experience where users can **browse, buy, add, and remove products from their cart**, all while ensuring **authentication and authorization** for security.

## 🚀 Features

### 🛍️ User Features
* **Product Browsing & Purchase**: Explore a wide range of products and place orders effortlessly.
* **Cart System**: Add or remove items from the cart with ease.
* **Authentication & Authorization**: Secure access with user authentication.

### 🔐 Admin Features
* **Product Management**: Add, update, and delete products.
* **Protected Admin Route**: Restricted access to administrative features.
* **Future Enhancements** (In Progress):
  * **User Analytics**: Track visitor activity and engagement.
  * **Product Reviews**: Allow customers to leave feedback and ratings.
  * **Comprehensive Admin Dashboard**: Gain insights into sales and customer behavior.

## 🛠️ Tech Stack

### 🏗️ Framework
* **Next.js** (Frontend + Backend)

### 🛢️ Database
* **MongoDB** (Mongoose ORM)

### 🎨 Styling
* **Tailwind CSS** 🎨
* **ShadCN UI** 💅

### ⚙️ State Management & Utilities
* **React Hook Form** 📄
* **Zod** 🛡️
* **Axios** 🌐

### 🔐 Authentication & Security
* **JWT (JSON Web Token)** 🔑
* **NextAuth.js** ⚡
* **Bcrypt** 🔒 (Password Hashing)

### 📧 Email Service
* **Nodemailer** ✉️

## 🌍 Open for Contributions

FastPiks is an evolving project! Developers are welcome to contribute and improve its features. Fork the repository and submit pull requests.

## 📌 Environment Variables

To run FastPiks locally, set up the following environment variables:

```
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
JWT_SECRET_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 🏁 Getting Started

Follow these steps to set up and run FastPiks on your local machine:

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/fastpiks.git
cd fastpiks
```

### 2️⃣ Install Dependencies
Ensure **Node.js** and **npm** are installed, then run:
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the required variables as listed above.

### 4️⃣ Set Up the Database
Ensure **MongoDB** is running locally or use a cloud-based database (e.g., MongoDB Atlas). Update `MONGODB_URI` in `.env` accordingly.

### 5️⃣ Start the Development Server
```sh
npm run dev
```
Your application will be available at **http://localhost:3000**

### 6️⃣ Build and Deploy (Optional)
To create a production build, run:
```sh
npm run build
npm start
```
For deployment, configure a platform like **Vercel** or **Netlify** with the necessary environment variables.

<div align="center">

## Stay tuned for more updates and enhancements! 🚀

</div>