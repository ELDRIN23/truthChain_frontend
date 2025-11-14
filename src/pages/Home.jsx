// src/components/Home.jsx
import React from "react";
import { MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0b16] via-[#10091b] to-[#07040b] overflow-hidden relative">

      {/* Futuristic Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-[#6b21a8]/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative text-center px-4 md:px-0">

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Verify Reality with{" "}
          <span className="bg-gradient-to-r from-[#6b21a8] to-[#b453ff] bg-clip-text text-transparent">
            TruthChain
          </span>
        </h1>

        <p className="mt-4 text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Upload an image or video and let our AI instantly detect whether it's real or AI-generated.  
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-3 px-7 py-3 text-lg rounded-full bg-gradient-to-r from-[#6b21a8] to-[#b453ff] text-white shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all"
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
    </div>
  );
}
