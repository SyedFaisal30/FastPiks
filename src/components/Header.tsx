import React, { useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import Link from "next/link"; // Import Link from next/link

// Define the types for the props
interface HeaderProps {
  username?: string;
  cartCount?: number;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ username = "John Doe", cartCount = 3, onProfileClick }) => {
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleProfileClick = () => {
    setDropdownOpen(!isDropdownOpen);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-70 shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        {/* Make the username clickable to navigate to the home page */}
        <Link href="/" passHref>
          <h1
            className="text-2xl sm:text-3xl font-bold font-serif text-gray-800 cursor-pointer"
          >
            {username}
          </h1>
        </Link>
        <div className="flex gap-6 items-center relative">
          <div className="relative cursor-pointer">
            <FaShoppingCart className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full px-1">
              {cartCount}
            </span>
          </div>
          <div className="cursor-pointer relative" onClick={handleProfileClick}>
            <FaUserCircle className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-48">
                <p className="text-gray-800 font-semibold">{username}</p>
                <p className="text-sm text-gray-600 mb-2">johndoe@example.com</p>
                <hr className="my-2" />
                <button
                  className="w-full text-left text-red-500 hover:text-red-700 text-sm mb-2"
                  onClick={() => alert("Logged out!")}
                >
                  Logout
                </button>
                <p className="text-gray-600 text-sm">Settings</p>
                <p className="text-gray-600 text-sm">Help</p>
                <p className="text-gray-600 text-sm">Privacy Policy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
