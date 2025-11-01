// components/about/SectionFour.jsx
import React from "react";
import FadeContent from "../../../animations/FadeContent";

const team = [
  { name: "Dr. Maya Patel", role: "Chief Medical Officer", bg: "from-[#5F6FFF] to-[#7480FF]" },
  { name: "Alex Chen", role: "Head of Engineering", bg: "from-[#F7971F] to-[#FF6B6B]" },
  { name: "Sarah Kim", role: "Product Lead", bg: "from-[#7480FF] to-[#A3A9FF]" },
];

const SectionFour = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#F8F9FF] to-white">
      <div className="max-w-7xl mx-auto text-center">
        <FadeContent delay={100}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Meet the <span className="text-[#5F6FFF]">Humans</span> Behind DocHub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Doctors, engineers, and dreamers — united to make healthcare work for everyone.
          </p>
        </FadeContent>

        <div className="grid md:grid-cols-3 gap-10">
          {team.map((member, i) => (
            <FadeContent key={i} delay={200 + i * 150}>
              <div className="group">
                <div className={`aspect-square rounded-3xl bg-gradient-to-br ${member.bg} p-1 mb-6`}>
                  <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center text-4xl font-bold text-gray-700">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionFour;