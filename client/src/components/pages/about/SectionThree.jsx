// components/about/SectionThree.jsx
import React from "react";
import Transition from "../../../animations/Transition";

const values = [
  {
    title: "Simplicity",
    desc: "Healthcare shouldn’t be complicated. One tap to book.",
  },
  { title: "Trust", desc: "Verified doctors. Real reviews. Zero surprises." },
  { title: "Speed", desc: "Book in 30 seconds. See a doctor today." },
  { title: "Care", desc: "Every patient matters. Every doctor is heard." },
];

const SectionThree = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#0A0E1A]">
      <div className="max-w-7xl mx-auto">
        <Transition direction="up" duration={1}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-16">
            Built on <span className="text-[#F7971F]">Values</span>
          </h2>
        </Transition>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <Transition key={i} delay={i * 0.2} direction="up">
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-500">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#F7971F] to-[#FF6B6B] rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </div>
            </Transition>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionThree;
