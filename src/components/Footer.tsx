import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f8f8f8] text-gray-800 py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-2xl text-gray-800 hover:text-gray-600 transition-colors" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-2xl text-gray-800 hover:text-gray-600 transition-colors" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-2xl text-gray-800 hover:text-gray-600 transition-colors" />
            </a>
          </div>
          
          <div className="flex justify-center flex-row md:flex-row items-center gap-4 md:gap-8 text-sm">
            <a href="/feedback" className="hover:text-gray-400">
              Feedback
            </a>
            <a href="/t&c" className="hover:text-gray-400">
              Terms & Conditions
            </a>
            <a href="/policy" className="hover:text-gray-400">
              Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;