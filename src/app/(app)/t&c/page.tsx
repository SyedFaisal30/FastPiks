"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function TermsAndConditions() {
    return (
        <>
        <Header></Header>
        <br />
        <br />
      <div className="w-[90%] mx-auto p-6 bg-full-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="mb-4">Welcome to FastFind!</p>
        <p className="mb-4">
          These terms and conditions outline the rules and regulations for the use of FastFind's Website,
          located at https://fastfind.vervel.com/.
        </p>
        <p className="mb-4">
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use
          FastFind if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Cookies</h2>
        <p className="mb-4">
          We employ the use of cookies. By accessing FastFind, you agreed to use cookies in agreement with
          FastFind's Privacy Policy.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">License</h2>
        <p className="mb-4">
          Unless otherwise stated, FastFind and/or its licensors own the intellectual property rights for all
          material on FastFind. All intellectual property rights are reserved. You may access this from FastFind
          for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">You must not:</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Republish material from FastFind</li>
          <li>Sell, rent, or sub-license material from FastFind</li>
          <li>Reproduce, duplicate, or copy material from FastFind</li>
          <li>Redistribute content from FastFind</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Content Liability</h2>
        <p className="mb-4">
          We shall not be held responsible for any content that appears on your Website. You agree to protect
          and defend us against all claims that arise on your Website.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Disclaimer</h2>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, we exclude all representations, warranties, and
          conditions relating to our website and the use of this website.
        </p>
      </div>
      <Footer></Footer>
        </>
    );
  }
  