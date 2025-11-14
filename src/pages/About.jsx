import React from "react";

export default function About() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0b16] via-[#10091b] to-[#07040b] text-white flex items-center justify-center px-6 py-10">
      
      <div className="max-w-4xl w-full text-center relative">

        {/* Glow Background */}
        <div className="absolute inset-0 flex justify-center -z-10">
          <div className="w-[450px] h-[450px] rounded-full bg-[#6b21a8]/20 blur-[100px]"></div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#6b21a8] to-[#b453ff] bg-clip-text text-transparent">
          About TruthChain
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          TruthChain is an AI-powered authenticity and deepfake-detection platform designed to
          restore trust in a world overwhelmed by synthetic media.  
          We combine advanced AI forensics with blockchain-backed verification to give users a
          mathematically proven way to confirm what is real.
        </p>

        {/* Team Story */}
        <div className="mt-10 text-left bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold mb-3 text-[#b453ff]">
            Our Journey
          </h2>

          <p className="text-gray-300 leading-relaxed">
            TruthChain was created by a four-member team—<span className="font-semibold text-white"> 
            Eldrin, Sreyas, Caine, and Cyril</span>—who traveled from Kerala to Bangalore with a 
            single objective: build something meaningful in the fight against misinformation.
          </p>

          <p className="text-gray-300 leading-relaxed mt-3">
            With limited resources, long travel hours, and intense time pressure, we faced obstacles 
            at every stage. But throughout the struggle, one idea kept us moving: 
            **real problems deserve real solutions**, not excuses.
          </p>

          <p className="text-gray-300 leading-relaxed mt-3">
            TruthChain is the result of that determination—proof that a small, focused team can build 
            technology that protects digital trust for millions.
          </p>
        </div>

        {/* Footer Line */}
        <p className="mt-10 text-sm text-gray-500">
          Built with purpose. Designed for truth.
        </p>
      </div>
    </div>
  );
}
