import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0f0b16]/95 via-[#10091b]/95 to-[#07040b]/95 text-gray-300 mt-12 border-t border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6">

        {/* Main Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#b453ff] to-[#6b21a8] text-transparent bg-clip-text">
              TruthChain
            </h2>
            <span className="hidden sm:inline-block text-xs text-gray-400">
              AI · Provenance · Verify
            </span>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-sm hover:text-white transition-colors">About</Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <a aria-label="GitHub" href="#" className="p-2 rounded-md hover:bg-white/5 hover:text-white transition">
              <FaGithub />
            </a>
            <a aria-label="LinkedIn" href="#" className="p-2 rounded-md hover:bg-white/5 hover:text-white transition">
              <FaLinkedin />
            </a>
            <a aria-label="Twitter" href="#" className="p-2 rounded-md hover:bg-white/5 hover:text-white transition">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-white/10" />

        {/* Copyright */}
        <div className="mt-3 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} TruthChain — All rights reserved.
        </div>
      </div>

      {/* Compact padding for mobile */}
      <style>{`
        @media (max-width: 640px) {
          footer { padding-bottom: 0.5rem; }
        }
      `}</style>
    </footer>
  );
}
