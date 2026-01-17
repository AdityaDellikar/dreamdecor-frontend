

import React from "react";

export default function HelpDesk() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--cream)] px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Help Desk</h1>
      <p className="text-gray-700 max-w-2xl text-lg leading-relaxed">
        For any inquiries related to <span className="font-semibold">product delivery, delays, tracking, quality</span>, 
        or any other assistance, please reach out to our official helpline at{" "}
        <span className="text-blue-600 font-semibold">+91 12345 67890</span>.  
        Simply send us a message saying <span className="italic">“Hi”</span> to begin chatting with our support team — 
        or connect directly with one of our customer care executives for personalized help.
      </p>
    </div>
  );
}