import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const embedSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1537648824738!2d78.12320947602102!3d9.92114907438462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c583297ba64f%3A0x82e6b5a836a4f3e7!2sArun%20Hospital%20Pvt%20Ltd%2C%20Madurai!5e0!3m2!1sen!2sin!4v1761986425761!5m2!1sen!2sin";

  return (
    <section className="min-h-screen pt-[200px] pb-[150px] bg-gradient-to-br from-indigo-50 via-white to-[#e8edff] py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-[#7480FF]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-[#7480FF] to-indigo-600 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're here to assist you with any inquiries or feedback. Reach out
            and let's start a conversation.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT SIDE - Contact Info + Map */}
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#7480FF]/10">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Get in Touch
              </h3>

              <div className="space-y-5">
                {[
                  {
                    icon: Phone,
                    title: "Phone",
                    value: "+91 452 123 4567",
                    href: "tel:+914521234567",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    value: "contact@dochub.com",
                    href: "mailto:contact@dochub.com",
                  },
                  {
                    icon: MapPin,
                    title: "Address",
                    value: "Arun Hospital Pvt Ltd, Madurai, Tamil Nadu",
                    href: "#",
                  },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#7480FF]/10 transition-all"
                  >
                    <div className="p-3 bg-gradient-to-br from-[#7480FF] to-indigo-600 text-white rounded-xl">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <p className="text-gray-800 font-medium">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Embedded Map */}
            <div className="h-80 md:h-96 rounded-3xl overflow-hidden shadow-xl border border-[#7480FF]/20">
              <iframe
                title="Arun Hospital Pvt Ltd, Madurai"
                src={embedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-3xl"
              />
            </div>
          </div>

          {/* RIGHT SIDE - Contact Form */}
          <div className="bg-white/80 backdrop-blur-lg flex flex-col  justify-center rounded-3xl shadow-2xl border border-[#7480FF]/20 p-10">
            <h3 className="text-3xl font-semibold text-gray-800 mb-8">
              Send a Message
            </h3>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Message sent successfully! We’ll respond soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-[#7480FF]/30 focus:border-[#7480FF] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-[#7480FF]/30 focus:border-[#7480FF] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-[#7480FF]/30 focus:border-[#7480FF] outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#7480FF] to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-md hover:shadow-[#7480FF]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
