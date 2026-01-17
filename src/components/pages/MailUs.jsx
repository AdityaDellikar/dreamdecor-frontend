import React, { useState } from "react";

export default function MailUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! Our team will get back to you shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--cream)] py-16 px-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Mail Us
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-2xl">
        We’d love to hear from you! Whether you have a query about our products,
        want to send your wishes, or inquire about career opportunities —
        simply fill out the form below, and we’ll get back to you soon.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject of your message"
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows="5"
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}