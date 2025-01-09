'use client';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaUserCircle, FaChevronLeft, FaChevronRight, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import './globals.css';

export default function NavbarWithCarousel() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { id: 1, image: '/path-to-image1.jpg', alt: 'Slide 1' },
    { id: 2, image: '/path-to-image2.jpg', alt: 'Slide 2' },
    { id: 3, image: '/path-to-image3.jpg', alt: 'Slide 3' },
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
    const interval = setInterval(nextSlide, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-[#f9f9f9] shadow-md z-50">
        <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          {/* Website Name */}
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800">Faisal</h1>

          {/* Icons */}
          <div className="flex gap-6 items-center relative">
            {/* Cart Icon */}
            <div className="relative cursor-pointer">
              <FaShoppingCart className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full px-1">3</span>
            </div>

            {/* Profile Icon */}
            <div className="cursor-pointer relative" onClick={handleProfileClick}>
              <FaUserCircle className="text-xl sm:text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200" />

              {/* Dropdown */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-48 max-w-xs"
                  style={{ maxHeight: '300px', overflowY: 'auto' }}
                >
                  <p className="text-gray-800 font-semibold">John Doe</p>
                  <p className="text-sm text-gray-600 mb-2">johndoe@example.com</p>
                  <hr className="my-2" />
                  <button
                    className="w-full text-left text-red-500 hover:text-red-700 text-sm mb-2"
                    onClick={() => alert('Logged out!')}
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

      {/* Carousel */}
      <div
        className="mt-16 flex justify-center items-center"
        style={{ marginTop: '8%' }}
      >
        <div
          className="relative w-[95vw] h-[70vh] overflow-hidden bg-gray-200 rounded-lg shadow-lg"
          style={{ borderRadius: '5vh' }}
        >
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ${index === currentIndex ? 'translate-x-0' : 'translate-x-full'}`}
              style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-600"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-600"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex justify-center gap-4 mt-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="w-[18vw] h-[50vh] bg-white border border-gray-200 rounded-[5vh] shadow-lg"
          >
            <div className="w-full h-3/4 bg-gray-300 rounded-t-[5vh]"></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">Card Title</h3>
              <p className="text-sm text-gray-600 mt-2">Description of the card goes here.</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Quick Links */}
            <div className="flex gap-6">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl hover:text-gray-400 transition-colors" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-2xl hover:text-gray-400 transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl hover:text-gray-400 transition-colors" />
              </a>
            </div>

            {/* Contact Us & Terms */}
            <div className="flex gap-8 text-sm">
              <a href="/contact-us" className="hover:text-gray-400">Contact Us</a>
              <a href="/terms-and-conditions" className="hover:text-gray-400">Terms & Conditions</a>
              <a href="/policy" className="hover:text-gray-400">Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        body {
          background-color: #f5f5f5; /* Off-white color */
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  );
}
