import React from "react";
import DocotrGroupImage from "../../../assets/about_image.png";

const SectionOne = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#7480FF]/20 via-white to-[#7480FF]/10 flex items-center px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#7480FF] to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              This is <span className="block">DocHub</span>
            </h1>

            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                At DocHub, we eliminate the chaos of healthcare scheduling.
                Patients book instantly. Doctors manage effortlessly. Health
                becomes human again.
              </p>

              <p className="text-lg text-gray-500 italic bg-gradient-to-r from-[#7480FF]/20 to-transparent bg-clip-text backdrop-blur-sm rounded-lg p-4 border border-[#7480FF]/20">
                Because every second spent waiting is a second not healing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-[#7480FF] to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-[#7480FF]/25 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm border border-[#7480FF]/20">
                <span className="flex items-center gap-2">
                  Get Started
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-[#7480FF]/30 text-gray-700 bg-white/70 backdrop-blur-sm rounded-xl font-semibold text-lg hover:border-[#7480FF]/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative group">
              <img
                src={DocotrGroupImage}
                alt="DocHub Team"
                className="rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-xl object-cover ring-2 ring-[#7480FF]/20 group-hover:ring-[#7480FF]/40 transition-all duration-500"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-[#7480FF]/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle floating elements for modern feel */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#7480FF]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-20 w-24 h-24 bg-[#7480FF]/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-[#7480FF]/20 to-transparent rounded-full blur-lg animate-float"></div>
    </section>
  );
};

export default SectionOne;
