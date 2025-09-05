


import React from "react";
import Gp from "../../assets/General_physician.svg";
import Gc from "../../assets/Gynecologist.svg";
import Dermatologist from "../../assets/Dermatologist.svg";
import Pediatricians from "../../assets/Pediatricians.svg";
import Neurologist from "../../assets/Neurologist.svg";
import Gastroenterologist from "../../assets/Gastroenterologist.svg";

const Filter = () => {
  const categories = [
    { name: "General physician", img: Gp },
    { name: "Gynecologist", img: Gc },
    { name: "Dermatologist", img: Dermatologist },
    { name: "Pediatricians", img: Pediatricians },
    { name: "Neurologist", img: Neurologist },
    { name: "Gastroenterologist", img: Gastroenterologist },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-10  ">
      <h1 className="font-medium text-[30px] text-center pt-20 px-6 pb-4">
        Find by Speciality
      </h1>
      <p className="text-center max-w-[500px] pb-8">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      {/* grid section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 ">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-105 transition"
          >
            <img src={cat.img} alt={cat.name} className="h-20 w-20 object-contain" />
            <p className="text-[13px] font-medium text-center">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
