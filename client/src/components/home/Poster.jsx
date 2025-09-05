import React, { useEffect, useRef } from "react";
import Sins from "../../assets/sins.jpeg";
import { gsap } from "gsap";

// Function to generate multiple box-shadows for stars
const multipleBoxShadow = (n) => {
  let value = `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
  }
  return value;
};

// Predefined box-shadows for different star sizes
const shadowsSmall = multipleBoxShadow(700);
const shadowsMedium = multipleBoxShadow(200);
const shadowsBig = multipleBoxShadow(100);

const Poster = () => {
  const starsRef = useRef(null);
  const stars2Ref = useRef(null);
  const stars3Ref = useRef(null);

  useEffect(() => {
    // GSAP animations for each star layer
    gsap.to(starsRef.current, {
      y: -2000,
      duration: 50,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(stars2Ref.current, {
      y: -2000,
      duration: 100,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(stars3Ref.current, {
      y: -2000,
      duration: 150,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <div className=" flex items-center justify-center py-12 lg:px-40 px-6 relative overflow-hidden pt-[140px]">
      {/* Star Field Container */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <div
          ref={starsRef}
          className="stars"
          style={{
            width: "1px",
            height: "1px",
            background: "transparent",
            boxShadow: shadowsSmall,
            position: "absolute",
            top: 0,
          }}
        >
          <div
            className="stars-after"
            style={{
              content: '""',
              position: "absolute",
              top: "2000px",
              width: "1px",
              height: "1px",
              background: "transparent",
              boxShadow: shadowsSmall,
            }}
          />
        </div>
        <div
          ref={stars2Ref}
          className="stars2"
          style={{
            width: "2px",
            height: "2px",
            background: "transparent",
            boxShadow: shadowsMedium,
            position: "absolute",
            top: 0,
          }}
        >
          <div
            className="stars2-after"
            style={{
              content: '""',
              position: "absolute",
              top: "2000px",
              width: "2px",
              height: "2px",
              background: "transparent",
              boxShadow: shadowsMedium,
            }}
          />
        </div>
        <div
          ref={stars3Ref}
          className="stars3"
          style={{
            width: "3px",
            height: "3px",
            background: "transparent",
            boxShadow: shadowsBig,
            position: "absolute",
            top: 0,
          }}
        >
          <div
            className="stars3-after"
            style={{
              content: '""',
              position: "absolute",
              top: "2000px",
              width: "3px",
              height: "3px",
              background: "transparent",
              boxShadow: shadowsBig,
            }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Book Appointment <br /> With Trusted Doctors
          </h1>
          <p className="text-[#c5c5c5] mb-6 text-lg">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free, and get the best healthcare
            at your convenience.
          </p>
          <button
            className="
    px-6 py-3 
    bg-[#f5961d] text-black 
    rounded-lg shadow-lg
    hover:bg-white hover:text-black 
    active:scale-95 active:shadow-sm
    transition-all duration-200
    cursor-pointer
  "
          >
            Book Appointment
          </button>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-end">
          <img
            src={Sins}
            alt="Doctor Poster"
            className="w-full object-top max-w-md h-120 rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Poster;
