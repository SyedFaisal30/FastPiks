"use client";
import { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

export default function NavbarWithCarousel() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { id: 1, image: "/Images/Display/1.jpg", alt: "Slide 1" },
    { id: 2, image: "/Images/Display/2.jpeg", alt: "Slide 2" },
    { id: 3, image: "/Images/Display/3.jpg", alt: "Slide 3" },
    { id: 4, image: "/Images/Display/4.jpg", alt: "Slide 4" },
    { id: 5, image: "/Images/Display/5.jpg", alt: "Slide 5" },
    { id: 6, image: "/Images/Display/6.jpg", alt: "Slide 4" },
    { id: 7, image: "/Images/Display/7.jpg", alt: "Slide 5" },
  ];

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-[#f9f9f9] shadow-md z-50">
        <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          {/* Website Name */}
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800">
            Faisal
          </h1>

          {/* Icons */}
          <div className="flex gap-6 items-center relative">
            {/* Cart Icon */}
            <div className="relative cursor-pointer">
              <FaShoppingCart className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full px-1">
                3
              </span>
            </div>

            {/* Profile Icon */}
            <div
              className="cursor-pointer relative"
              onClick={handleProfileClick}
            >
              <FaUserCircle className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />

              {/* Dropdown */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-48 max-w-xs"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <p className="text-gray-800 font-semibold">John Doe</p>
                  <p className="text-sm text-gray-600 mb-2">
                    johndoe@example.com
                  </p>
                  <hr className="my-2" />
                  <button
                    className="w-full text-left text-red-500 hover:text-red-700 text-sm mb-2"
                    onClick={() => alert("Logged out!")}
                  >
                    Logout
                  </button>
                  {/* Additional Content */}
                  <p className="text-gray-600 text-sm">Settings</p>
                  <p className="text-gray-600 text-sm">Help</p>
                  <p className="text-gray-600 text-sm">Privacy Policy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}