"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CancellationExchangePolicy() {
  return (
    <>
      <Header />
      <br />
      <br />
      <div className="bg-full-white min-h-screen">
        <div className="w-[90%] mx-auto py-10 px-6">
          <h1 className="text-2xl font-bold mb-6">
            Cancellation & Exchange Policy
          </h1>
          <p className="mb-4">
            FastFind follows a friendly policy to ensure your purchases are
            stress-free. We offer a
            <strong> “100% Buyer Protection Program” </strong> for our valued
            customers.
          </p>

          <h2 className="text-xl font-semibold mt-6">Size Exchange</h2>
          <p className="mb-4">
            At FastFind, we confirm your size before dispatching any product.
            However, if there is any size issue later, customers must email us
            within <strong>48 hours</strong> of delivery. Customers need to
            return the product in good condition to our address and pay{" "}
            <strong>200 Rs</strong> as a re-shipping fee.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Exchange is allowed for size issues only.</li>
            <li>Exchange will not be issued on product exchange.</li>
            <li>
              All purchases made during offers and discounts are
              non-exchangeable.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">Return Policy</h2>
          <p className="mb-4">We do not accept returns on items sold.</p>

          <h2 className="text-xl font-semibold mt-6">Damaged/Wrong Delivery</h2>
          <p className="mb-4">
            If a product is damaged, defective, or an incorrect item is sent, we
            will replace it as soon as possible and arrange a reverse pickup at
            no extra cost.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            When is Exchange Not Accepted?
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Exchange is not accepted due to a{" "}
              <strong>color difference</strong> (up to 10% variation may occur
              due to screen resolution and lighting).
            </li>
            <li>
              Exchanges are not accepted if the customer does not like the
              material or color.
            </li>
            <li>
              Exchanges are not accepted for specially customized products.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">
            Cancellations & Refunds
          </h2>
          <p className="mb-4">
            Orders <strong>cannot be canceled</strong> once placed, and{" "}
            <strong>no refunds</strong> will be issued.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
