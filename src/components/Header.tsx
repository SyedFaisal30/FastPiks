// "use client"; // Ensures hooks work in Next.js App Router
// import React, { useState, useEffect } from "react";
// import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
// import { signIn, signOut, useSession } from "next-auth/react";
// import Link from "next/link";

// // Header component
// const Header: React.FC = () => {
//   const { data: session } = useSession(); // Get session data
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [cartCount, setCartCount] = useState<number>(0);
//   const [cart, setCart] = useState<any[]>([]); // Cart items can be fetched from state or API

//   const handleProfileClick = () => {
//     setDropdownOpen(!isDropdownOpen);
//   };

//   // Function to calculate the total cart count
//   const calculateCartCount = (items: any[]) => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   };

//   useEffect(() => {
//     // Fetch cart items (you should replace this URL with your actual API endpoint)
//     const fetchCartItems = async () => {
//       try {
//         const response = await fetch("/api/cart-handler", {
//           method: "GET", // Assuming you fetch cart with GET, change if needed
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await response.json();
        
//         // Set cart items and update cart count
//         if (data.cart) {
//           setCart(data.cart.items); // Set the cart items
//           setCartCount(calculateCartCount(data.cart.items)); // Calculate the total cart count
//         }
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       }
//     };

//     fetchCartItems();
//   }, []); // This will run only once when the component is mounted

//   return (
//     <header className="fixed top-0 left-0 w-full bg-opacity-70 shadow-md z-50">
//       <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
//         <Link href="/" passHref>
//           <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800 cursor-pointer">
//             FashionFiesta
//           </h1>
//         </Link>
//         <div className="flex gap-6 items-center relative">
//           <Link href="/cart" passHref>
//             <div className="relative cursor-pointer">
//               <FaShoppingCart className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
//               {cartCount > 0 && (
//                 <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </div>
//           </Link>
//           <div className="cursor-pointer relative" onClick={handleProfileClick}>
//             <FaUserCircle className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-48">
//                 {session?.user ? (
//                   <>
//                     <p className="text-gray-800 font-semibold">{session.user.username || "Guest"}</p>
//                     <button
//                       className="w-full text-left text-red-500 hover:text-red-700 text-sm mt-2"
//                       onClick={() => signOut()}
//                     >
//                       Sign Out
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     className="w-full text-left text-blue-500 hover:text-blue-700 text-sm"
//                     onClick={() => signIn()}
//                   >
//                     Sign In
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa"; // Using FontAwesome icons

const Header = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<any>({ items: [] });
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Fetch user's cart and calculate the total number of items
  useEffect(() => {
    const fetchCart = async () => {
      if (session?.user) {
        try {
          const response = await axios.get("/api/fetch-cart-products");
          setCart(response.data.cart);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, [session]);

  // Calculate total items in the cart
  const getTotalItems = () => {
    return cart.items.reduce((acc: number, product: any) => acc + product.quantity, 0);
  };

  // Toggle the user profile dropdown
  const handleProfileClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-70 shadow-md z-50">
      <div className="header-container flex justify-between items-center p-4">
        <Link href="/">
          <h1 className="text-xl font-bold">FashionFiesta</h1>
        </Link>

        <div className="flex gap-6 items-center relative">
          {/* Cart Icon with Badge */}
          <Link href="/cart">
            <div className="relative cursor-pointer">
              <FaShoppingCart className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center -mt-2 -mr-2">
                  {getTotalItems()}
                </span>
              )}
            </div>
          </Link>
          {/* User Profile Icon with Dropdown */}
          <div className="cursor-pointer relative" onClick={handleProfileClick}>
            <FaUserCircle className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-48">
                {session?.user ? (
                  <>
                    <p className="text-gray-800 font-semibold">{session.user.username || "Guest"}</p>
                    <button
                      className="w-full text-left text-red-500 hover:text-red-700 text-sm mt-2"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full text-left text-blue-500 hover:text-blue-700 text-sm"
                    onClick={() => signIn()}
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
