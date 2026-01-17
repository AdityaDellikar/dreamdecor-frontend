import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineInfoCircle,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineAppstore,
  AiOutlineMenu,
} from "react-icons/ai";

import logo from "../../assets/logoddd.png";

export default function Navbar() {
  const [showProducts, setShowProducts] = useState(false);
  //const [showContact, setShowContact] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);

  /** Close profile menu if clicked outside */
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  return (
    <> { }
    <nav className="fixed top-0 left-0 w-full z-[40] bg-white/80 backdrop-blur-md shadow-sm isolate">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT — Hamburger (mobile only) */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-2xl text-gray-700"
        >
          <AiOutlineMenu />
        </button>

        {/* CENTER — Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer mx-auto md:mx-0"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="DhanaDecor logo"
            className="w-12 h-10 object-contain"
          />
          <span className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight leading-none">
            DhanaDecor
          </span>
        </div>

        {/* RIGHT — Profile (mobile only) */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMobileProfileOpen((prev) => !prev)}
            className="flex flex-col items-center text-gray-700"
          >
            <AiOutlineUser className="text-2xl" />
            <span className="text-[10px] mt-1">
              {isLoggedIn ? user?.name?.split(" ")[0] : "Profile"}
            </span>
          </button>

          {mobileProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border z-50 overflow-hidden"
            >
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileProfileOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileProfileOpen(false);
                      navigate("/signup");
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 text-sm text-gray-600 border-b">
                    Hi, {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      setMobileProfileOpen(false);
                      navigate("/orders");
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setMobileProfileOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* CENTER NAVIGATION */}
        <ul className="hidden md:flex space-x-10 text-gray-700 font-medium items-center relative">
          <NavItem
            icon={<AiOutlineHome />}
            label="Home"
            onClick={() => navigate("/")}
          />

          {/* PRODUCTS DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setShowProducts(true)}
            onMouseLeave={() => setShowProducts(false)}
          >
            <NavItem
              icon={<AiOutlineAppstore />}
              label="Products"
              onClick={() => navigate("/products")}
            />

            {showProducts && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bg-white shadow-lg rounded-md py-2 w-32 top-12"
              >
                <li
                  onClick={() => navigate("/products")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Large
                </li>
                <li
                  onClick={() => navigate("/products")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Small
                </li>
              </motion.ul>
            )}
          </div>

          <NavItem
            icon={<AiOutlineHeart />}
            label="Favourites"
            onClick={() => isLoggedIn ? navigate("/favourites") : navigate("/login")}
          />

          <NavItem
            icon={<AiOutlineShoppingCart />}
            label="Cart"
            onClick={() => isLoggedIn ? navigate("/cart") : navigate("/login")}
          />

          {/* CONTACT DROPDOWN */}
          {/* <div
            className="relative"
            onMouseEnter={() => setShowContact(true)}
            onMouseLeave={() => setShowContact(false)}
          >
            <NavItem icon={<AiOutlineMail />} label="Contact" />

            {showContact && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bg-white shadow-lg rounded-md py-2 w-36 top-12"
              >
                <li
                  onClick={() => navigate("/mailus")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Mail Us
                </li>
              </motion.ul>
            )}
          </div> */}

          <NavItem 
          icon={<AiOutlineMail />} label="Contact"
          onClick={() => navigate("/mailus") }
          />

          <NavItem
            icon={<AiOutlineInfoCircle />}
            label="About"
            onClick={() => navigate("/about")}
          />
        </ul>

        {/* RIGHT — SIGN UP + PROFILE */}
        <div ref={profileRef} className="hidden md:flex items-center space-x-4 relative">

          {!isLoggedIn && (
            <span
              onClick={() => navigate("/signup")}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 cursor-pointer underline-offset-2 hover:underline"
            >
              Sign Up
            </span>
          )}

          {/* Profile Icon */}
          <motion.div
            onClick={() => setShowProfile((prev) => !prev)}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            <AiOutlineUser className="text-2xl" />
            <span className="text-xs mt-1">
              {isLoggedIn ? user?.name.split(" ")[0] : "Profile"}
            </span>
          </motion.div>

          {/* DROPDOWN MENU */}
          {showProfile && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 w-40"
            >
              {!isLoggedIn ? (
                <>
                  <li
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Sign Up
                  </li>
                  <li
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Log In
                  </li>
                </>
              ) : (
                <>
                  <li className="px-4 py-2 text-gray-700">
                    Hi, {user?.name}
                  </li>
                  <li
                    onClick={() => navigate("/orders")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Orders
                  </li>
                  <li
                    onClick={logout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Log Out
                  </li>
                </>
              )}
            </motion.ul>
          )}
        </div>
      </div>
    </nav>

    {mobileOpen && (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-0 z-[9999] bg-[#F6F4F2] opacity-100 shadow-2xl"
      >
        {/* Top bar */}
        <div className="h-14 flex items-center px-6 border-b border-black/10">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <div className="px-6 pt-8 space-y-8 text-xl font-medium text-black">
          <div onClick={() => setMobileOpen(false) || navigate("/")}>Home</div>
          <div onClick={() => setMobileOpen(false) || navigate("/products")}>Products</div>
          <div onClick={() => setMobileOpen(false) || navigate("/favourites")}>Favourites</div>
          <div onClick={() => setMobileOpen(false) || navigate("/cart")}>Cart</div>
          <div onClick={() => setMobileOpen(false) || navigate("/about")}>About</div>
          <div onClick={() => setMobileOpen(false) || navigate("/mailus")}>Contact</div>
        </div>
      </motion.div>
    )}
    </>
  );
}

/* Reusable NavItem */
const NavItem = ({ icon, label, onClick }) => (
  <motion.div
    className="relative flex flex-col items-center text-gray-600 hover:text-blue-500 cursor-pointer group"
    onClick={onClick}
    whileHover={{ scale: 1.15, y: -2 }}
    transition={{ type: "spring", stiffness: 300, damping: 12 }}
  >
    <motion.span
      className="text-2xl"
      whileHover={{
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.6, ease: "easeOut" },
      }}
    >
      {icon}
    </motion.span>
    <span className="text-xs mt-1">{label}</span>
    <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-blue-500 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300 rounded-full"></span>
  </motion.div>
);
