"use client";
import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export default function NavbarWithCarousel() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { id: 1, image: "/Images/Display/1.jpg", alt: "Slide 1" },
    { id: 2, image: "/Images/Display/2.jpeg", alt: "Slide 2" },
    { id: 3, image: "/Images/Display/3.jpg", alt: "Slide 3" },
    { id: 4, image: "/Images/Display/4.jpg", alt: "Slide 4" },
    { id: 5, image: "/Images/Display/5.jpg", alt: "Slide 5" },
    { id: 6, image: "/Images/Display/6.jpg", alt: "Slide 6" },
    { id: 7, image: "/Images/Display/7.jpg", alt: "Slide 7" },
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

  const cardData = [
    {
      title: "Men's",
      image: "/Images/Producta/Men.jpg",
      link: "/category/Men",
    },
    {
      title: "Women's",
      image: "/Images/Producta/Women.jpg",
      link: "/category/Women",
    },
    {
      title: "Kids",
      image: "/Images/Producta/Kid.jpg",
      link: "/category/Kid",
    },
    {
      title: "Footwear",
      image: "/Images/Producta/Footwear.jpeg",
      link: "/category/Footwear",
    },
    {
      title: "Accessories",
      image: "/Images/Producta/Accessorie.jpeg",
      link: "/category/Accessories",
    },
  ];
  
  return (
    <>
      {/* Navbar */}
      <Header/>
      {/* Carousel */}
      <div className="mt-20 flex justify-center items-center">
      <div className="relative w-[95vw] h-[30vh] md:h-[70vh] overflow-hidden bg-gray-200 rounded-lg shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-transform duration-1000"
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/75 text-white rounded-full p-2 shadow-md hover:bg-gray-600 transition-colors"
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/75 text-white rounded-full p-2 shadow-md hover:bg-gray-600 transition-colors"
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>

      {/* Cards Section */}
      <div>
      <div className="flex flex-wrap w-[100%] gap-5 justify-center mt-4">
        {cardData.map((card, index) => (
          <Link 
            href={card.link} 
            key={index} 
            className="w-[45%] h-[35vh] md:w-[18%] md:h-[50vh]  "
          >
            <div className="relative w-full h-full rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition duration-300">
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 rounded-b-lg p-4">
                <h3 className="text-sm md:text-xl lg:text-2xl font-extrabold text-white text-center truncate">
                  {card.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>

      {/* Footer */}
      <Footer/>
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
