import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full backdrop-blur-xl bg-[#0c0712]/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-[#6b21a8] to-[#b453ff] bg-clip-text text-transparent"
        >
          TruthChain
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-300">
          <Link
            to="/"
            className="hover:text-white transition font-medium"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="hover:text-white transition font-medium"
          >
            About
          </Link>

          <Link
            to="/upload"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6b21a8] to-[#b453ff] text-white shadow-lg hover:scale-105 transition"
          >
            Upload
          </Link>
        </div>

        {/* Mobile Menu Icon (for future expansion) */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white">
            ☰
          </button>
        </div>

      </div>
    </nav>
  );
}
