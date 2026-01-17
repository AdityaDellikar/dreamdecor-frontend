import React from "react";
import { FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";   // ⭐ Added Router Link support

export default function Footer() {
  return (
    <footer
      className="
        w-full bg-[var(--cream)] text-[var(--midchar)]
        border-t border-[var(--brownline)]
        pt-12 pb-8 mt-16
      "
    >
      <div className="container mx-auto px-6 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">

        {/* Brand */}
        <div>
          <h3 className="font-semibold text-xl md:text-2xl text-[var(--brand)] mb-2">
            DhanaDecor
          </h3>
          <p className="text-sm leading-relaxed opacity-80 max-w-sm">
            Premium CNC-crafted stainless-steel wall art designed to enhance
            spaces with modern artistry and timeless craftsmanship.
          </p>

          <div className="flex gap-4 mt-5">
            <a
              href="https://www.instagram.com/thedhanadecor?igsh=MWl2djRmaXBlMHB2aQ=="
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--brownline)]
              hover:bg-[var(--brand)] hover:text-white transition-all duration-300 hover:-translate-y-1"
            >
              <FiInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-3 text-[var(--brand)]">Quick Links</h4>
          <ul className="space-y-3 text-sm">

            <li className="cursor-pointer hover:text-[var(--brand)] transition relative w-fit
              after:block after:h-[2px] after:bg-[var(--brand)] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              <Link to="/">Home</Link>
            </li>

            <li className="cursor-pointer hover:text-[var(--brand)] transition relative w-fit
              after:block after:h-[2px] after:bg-[var(--brand)] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              <Link to="/products">Products</Link>
            </li>

            <li className="cursor-pointer hover:text-[var(--brand)] transition relative w-fit
              after:block after:h-[2px] after:bg-[var(--brand)] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              <Link to="/favourites">Favourites</Link>
            </li>

            <li className="cursor-pointer hover:text-[var(--brand)] transition relative w-fit
              after:block after:h-[2px] after:bg-[var(--brand)] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              <Link to="/cart">Cart</Link>
            </li>

          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-lg mb-3 text-[var(--brand)]">Support</h4>
          <ul className="space-y-3 text-sm">

            <li className="cursor-pointer hover:text-[var(--brand)] transition relative w-fit
              after:block after:h-[2px] after:bg-[var(--brand)] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              <Link to="/helpdesk">Help Desk</Link>
            </li>

            <li className="cursor-pointer hover:text-[var(--brand)] transition relative w-fit
              after:block after:h-[2px] after:bg-[var(--brand)] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              <Link to="/mailus">Mail Us</Link>
            </li>

            <li className="cursor-pointer hover:text-[var(--brand)] transition relative w-fit
              after:block after:h-[2px] after:bg-[var(--brand)] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              <Link to="/about">About Us</Link>
            </li>

          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-lg mb-3 text-[var(--brand)]">Stay Updated</h4>
          <p className="text-sm opacity-80 mb-4 max-w-xs">
            Join our newsletter for updates on new designs and exclusive offers.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 bg-white rounded-lg border border-[var(--brownline)] p-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 outline-none text-sm bg-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--brand)] text-white text-sm font-medium rounded-md hover:bg-opacity-90 transition"
            >
              Join
            </button>
          </form>
        </div>

      </div>

      <div className="text-center text-xs mt-10 opacity-70">
        © {new Date().getFullYear()} DhanaDecor. All Rights Reserved.
      </div>
    </footer>
  );
}