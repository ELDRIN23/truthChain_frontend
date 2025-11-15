// src/components/Home.jsx
import React from "react";
import { MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0b16] via-[#10091b] to-[#07040b] overflow-hidden relative">
      {/* ===== LUXURIOUS LEFT→RIGHT CORNER-TO-CORNER MARQUEE ===== */}
      <div className="absolute top-0 left-0 w-full overflow-hidden bg-black/25 backdrop-blur-lg border-b border-white/6 py-3 z-50">
        <div
          className="mx-auto max-w-full"
          style={{ display: "block" }}
          aria-hidden="false"
          role="status"
        >
          {/* viewport */}
          <div className="marquee-viewport relative w-full overflow-hidden">
            {/* track: duplicated items ensure seamless loop */}
            <div className="marquee-track inline-flex items-center whitespace-nowrap will-change-transform">
              <span className="marquee-item px-8 text-sm md:text-base font-medium tracking-wide text-gray-100/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6b21a8] to-[#b453ff]">
                  TruthChain — Trusted AI fake-content detection powered by
                  Blockchain
                </span>
                <span className="ml-2 text-gray-300">•</span>
              </span>

              <span className="marquee-item px-8 text-sm md:text-base font-medium tracking-wide text-gray-100/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6b21a8] to-[#b453ff]">
                  TruthChain — Trusted AI fake-content detection powered by
                  Blockchain
                </span>
                <span className="ml-2 text-gray-300">•</span>
              </span>

              <span className="marquee-item px-8 text-sm md:text-base font-medium tracking-wide text-gray-100/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6b21a8] to-[#b453ff]">
                  TruthChain — Trusted AI fake-content detection powered by
                  Blockchain
                </span>
                <span className="ml-2 text-gray-300">•</span>
              </span>

              {/* extra duplicates to avoid gaps on very wide screens */}
              <span className="marquee-item px-8 text-sm md:text-base font-medium tracking-wide text-gray-100/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6b21a8] to-[#b453ff]">
                  TruthChain — Trusted AI fake-content detection powered by
                  Blockchain
                </span>
                <span className="ml-2 text-gray-300">•</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[520px] h-[520px] bg-[#6b21a8]/20 blur-[140px] rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative text-center px-4 md:px-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-md">
          Verify Reality with{" "}
          <span className="bg-gradient-to-r from-[#6b21a8] to-[#b453ff] bg-clip-text text-transparent">
            TruthChain
          </span>
        </h1>

        <p className="mt-4 text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Upload an image or video and let our AI instantly detect whether it's
          real or AI-generated.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() =>
              (window.location.href = "https://truth-chain-rho.vercel.app/")
            }
            className="inline-flex items-center gap-3 px-7 py-3 text-lg rounded-full bg-gradient-to-r from-[#6b21a8] to-[#b453ff] text-white shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <MdUpload size={22} />
            Upload Image / Video
          </button>

          <button
            onClick={() => navigate("/upload")}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gray-700 text-gray-200 hover:bg-white/5 transition"
          >
            Try Demo Upload
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Supports images & videos • Privacy-first • Built for teams
        </p>
      </div>

      {/* ===== INLINE STYLES FOR MARQUEE ===== */}
      <style>{`
        /* core marquee animation: LEFT -> RIGHT corner-to-corner
           track starts fully off-left (-100%) and finishes fully off-right (100%)
           duplicates ensure continuous stream with no gaps */
        .marquee-viewport { height: 1.75rem; display: block; }

        .marquee-track {
          display: inline-flex;
          gap: 0;
          align-items: center;
          /* long animation - change duration to speed up/slow down */
          animation: marquee-ltr 20s linear infinite;
          transform: translateX(-100%); /* initial fallback */
        }

        .marquee-item {
          flex: 0 0 auto;
          white-space: nowrap;
        }

        @keyframes marquee-ltr {
          0%   { transform: translateX(-100%); } /* fully off the left edge */
          100% { transform: translateX(100%); }  /* fully off the right edge */
        }

        /* optional: reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; transform: translateX(0); }
        }

        /* responsive tweaks */
        @media (max-width: 640px) {
          .marquee-viewport { height: 1.5rem; }
          .marquee-item { padding-left: 0.75rem; padding-right: 0.75rem; font-size: 0.85rem; }
        }

        /* small visual polish for better contrast on dark background */
        .marquee-item span { text-shadow: 0 1px 10px rgba(107,33,168,0.12); }
      `}</style>
    </div>
  );
}
