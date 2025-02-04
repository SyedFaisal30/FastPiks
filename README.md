FastPiks - The Ultimate E-Commerce Platform

FastPiks is a dynamic and feature-rich e-commerce platform built with Next.js, ShadCN UI, and Tailwind CSS. It offers a seamless shopping experience where users can browse, buy, add, and remove products from their cart while ensuring authentication and authorization for security.

🚀 Features

🛍️ User Features

Product Management: Browse and purchase a variety of products.

Cart System: Add and remove items from the cart effortlessly.

Authentication & Authorization: Secure login and access control.

🔐 Admin Features

Product Management: Add, update, and delete products.

Protected Admin Route: Ensures only authorized users can manage products.

Future Enhancements (In Progress):

User Analytics: Track user visits and activity.

Product Reviews: Users can rate and review products.

Detailed Admin Dashboard: Insights on sales and customer behavior.

🛠️ Tech Stack

Frontend: Next.js, Tailwind CSS, ShadCN UI

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ORM)

Cloud Storage: Cloudinary (for product images)

Authentication: NextAuth.js with JWT-based authentication

🌍 Open for Contributions

FastPiks is an ever-evolving project! Developers are welcome to contribute and enhance its features. Feel free to fork and submit pull requests.

📌 Environment Variables

To run FastPiks locally, configure the following environment variables:

MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
JWT_SECRET_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

🏁 Getting Started

Follow these steps to set up and run FastPiks on your local machine:

1️⃣ Clone the Repository

git clone https://github.com/your-repo/fastpiks.git
cd fastpiks

2️⃣ Install Dependencies

Make sure you have Node.js and npm installed, then run:

npm install

3️⃣ Configure Environment Variables

Create a .env file in the root directory and add the required environment variables as listed above.

4️⃣ Set Up the Database

Ensure that MongoDB is running on your local machine or use a cloud database (MongoDB Atlas). Update MONGODB_URI in .env accordingly.

5️⃣ Start the Development Server

Run the following command to start the project:

npm run dev

Your application should now be running on http://localhost:3000

6️⃣ Build and Deploy (Optional)

To create a production build, run:

npm run build
npm start

For deployment, configure a platform like Vercel or Netlify with the necessary environment variables.

Stay tuned for more updates and enhancements! 🚀
