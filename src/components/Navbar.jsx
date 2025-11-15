import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-b from-[#0f0b16]/95 via-[#10091b]/95 to-[#07040b]/95 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-[#b453ff] to-[#6b21a8] bg-clip-text text-transparent"
        >
          TruthChain
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-300">
          <Link to="/" className="hover:text-white transition font-medium">
            Home
          </Link>

          <Link to="/about" className="hover:text-white transition font-medium">
            About
          </Link>

          <a
            href="https://truth-chain-rho.vercel.app/"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6b21a8] to-[#b453ff] text-white shadow-lg hover:scale-105 transition"
          >
            Upload
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white">☰</button>
        </div>

      </div>
    </nav>
  );
}
