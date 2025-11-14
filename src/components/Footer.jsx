import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[rgba(18,14,28,0.6)] text-gray-200 mt-12 border-t border-gray-700/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        {/* Main row: stacks on small screens */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Brand (left on desktop, top on mobile) */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-primary tracking-wide">
              TruthChain
            </h2>
            <span className="hidden sm:inline-block text-xs text-gray-400">AI · Provenance · Verify</span>
          </div>

          {/* Links (center on desktop, middle on mobile) */}
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            <Link to="/upload" className="text-sm hover:text-primary transition-colors">Upload</Link>
          </nav>

          {/* Social (right on desktop, bottom on mobile) */}
          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <a aria-label="GitHub" href="#" className="p-2 rounded-md hover:text-white hover:bg-[rgba(180,83,255,0.06)] transition">
              <FaGithub />
            </a>
            <a aria-label="LinkedIn" href="#" className="p-2 rounded-md hover:text-white hover:bg-[rgba(180,83,255,0.06)] transition">
              <FaLinkedin />
            </a>
            <a aria-label="Twitter" href="#" className="p-2 rounded-md hover:text-white hover:bg-[rgba(180,83,255,0.06)] transition">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-gray-700/10" />

        {/* Bottom row */}
        <div className="mt-3 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} TruthChain — All rights reserved.
        </div>
      </div>

      {/* Optional small inline styles to preserve compact look */}
      <style>{`
        @media (max-width: 640px) {
          footer { padding-bottom: 0.5rem; }
        }
      `}</style>
    </footer>
  );
}
