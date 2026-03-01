"use client";

import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="relative py-32 px-6 text-center text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Creative Intelligence. Strategic Execution. Measurable Growth.
          </h1>

          <p className="text-lg md:text-xl opacity-90 mb-10">
            Let’s build a smarter marketing system designed to scale your brand
            and accelerate revenue.
          </p>

          <a
            href="#contact-form"
            className="inline-block bg-secondary px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition shadow-lg"
          >
            Schedule Your Free Strategy Session
          </a>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section
        id="contact-form"
        className="py-24 px-6 bg-gray-50"
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">

          {/* LEFT SIDE */}
          <div>
            <h2 className="font-heading text-3xl font-semibold mb-6">
              Let’s Start the Conversation
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Tell us about your business goals, challenges, and vision.
              Our team will review your submission and connect with you
              to discuss strategic next steps.
            </p>

            <div className="space-y-4 text-gray-700">
              <p><strong>Email:</strong> hello@chatterbuzz.com</p>
              <p><strong>Phone:</strong> +1 (800) 123-4567</p>
              <p><strong>Location:</strong> Orlando, FL</p>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition"
              />

              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition"
              />

              <textarea
                name="message"
                rows={5}
                placeholder="Tell us about your project..."
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition"
              />

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                Submit Request
              </button>

            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
