// components/about/SectionFive.jsx
import React from "react";
import Transition from "../../../animations/Transition";

const SectionFive = () => {
  return (
    <section className="py-28 px-6 md:px-12 lg:px-20 bg-gradient-to-t from-[#5F6FFF] to-[#7480FF] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <Transition direction="up" duration={1.2}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            Ready to Simplify Healthcare?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Join thousands of patients and doctors already using DocHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-[#5F6FFF] px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300">
              Book a Demo
            </button>
            <button className="border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#5F6FFF] transition-all duration-300">
              For Doctors
            </button>
          </div>
        </Transition>
      </div>
    </section>
  );
};

export default SectionFive;