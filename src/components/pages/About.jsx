import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--cream)] px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About DhanaDecor</h1>
      <p className="text-gray-700 max-w-2xl text-lg leading-relaxed">
        At <span className="font-semibold text-blue-600">DhanaDecor</span>, our team is dedicated to creating
        sleek, elegant, and inspiring home décor pieces that truly match your vibe and tribe.
        Each product is meticulously crafted from premium powder-coated steel using advanced 3D cutting technology,
        ensuring exceptional quality and timeless beauty that elevates the aura of every wall it graces.
      </p>
    </div>
  );
}
