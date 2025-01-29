"use client"; // Ensures hooks work in Next.js App Router
import React, { useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

// Define the props interface for the Header component
interface HeaderProps {
  username: string;
  cartCount: number;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, cartCount, onProfileClick }) => {
  const { data: session } = useSession(); // Get session data
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-70 shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <Link href="/" passHref>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800 cursor-pointer">
            FashionFiesta
          </h1>
        </Link>
        <div className="flex gap-6 items-center relative">
          <div className="relative cursor-pointer">
            <FaShoppingCart className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
            <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <div className="cursor-pointer relative" onClick={handleProfileClick}>
            <FaUserCircle className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-48">
                {session?.user ? (
                  <>
                    <p className="text-gray-800 font-semibold">{username}</p>
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
