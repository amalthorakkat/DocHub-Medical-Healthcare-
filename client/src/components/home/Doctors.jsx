// import React from "react";
// import { useNavigate } from "react-router-dom";

// import Doc1 from "../../assets/doc1.png";
// import Doc2 from "../../assets/doc2.png";
// import Doc3 from "../../assets/doc3.png";
// import Doc4 from "../../assets/doc4.png";
// import Doc5 from "../../assets/doc5.png";
// import Doc6 from "../../assets/doc6.png";
// import Doc7 from "../../assets/doc7.png";
// import Doc8 from "../../assets/doc8.png";
// import Doc9 from "../../assets/doc9.png";
// import Doc10 from "../../assets/doc10.png";

// const Doctors = () => {

//   const navigate = useNavigate()

//   const doctors = [
//     { name: "Dr. Richard James", specialty: "General physician", image: Doc1 },
//     { name: "Dr. Emily Larson", specialty: "Gynecologist", image: Doc2 },
//     { name: "Dr. Sarah Patel", specialty: "Dermatologist", image: Doc3 },
//     { name: "Dr. Christopher Lee", specialty: "Pediatricians", image: Doc4 },
//     { name: "Dr. Jennifer Garcia", specialty: "Neurologist", image: Doc5 },
//     {
//       name: "Dr. Andrew Williams",
//       specialty: "Gastroenterologist",
//       image: Doc6,
//     },
//     {
//       name: "Dr. Christopher Davis",
//       specialty: "General physician",
//       image: Doc7,
//     },
//     { name: "Dr. Timothy White", specialty: "Gynecologist", image: Doc8 },
//     { name: "Dr. Ava Mitchell", specialty: "Dermatologist", image: Doc9 },
//     { name: "Dr. Jeffrey King", specialty: "Pediatricians", image: Doc10 },
//   ];

//   return (
//     <div className="  ">
//       <div className=" flex items-center justify-center flex-col ">
//         <h1 className="font-medium text-[30px] text-center pt-20 px-6 pb-4">
//           Explore by Specialties
//         </h1>
//         <p className="text-center max-w-[500px] pb-8 mx-auto text-gray-600">
//           Find the right doctor by choosing from a wide range of medical
//           specialties tailored to your needs.
//         </p>
//       </div>
//       <div className="flex justify-center ">
//         <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//           {doctors.map((doctor, index) => (
//             <div
//               key={index}
//               onClick={()=>navigate('/doc-bio')}
//               className=" cursor-pointer border w-[300px] sm:w-[200px] rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-inner"
//             >
//               <div className="bg-[#c2c2c2]">
//                 <img src={doctor.image} alt={doctor.name} className="w-full" />
//               </div>
//               <div className="text-center p-3">
//                 <h1 className="text-green-500 text-[10px]">Available</h1>
//                 <h1 className="font-medium">{doctor.name}</h1>
//                 <p className="text-[#6c6c6c] text-[13px]">{doctor.specialty}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex items-center justify-center py-10">
//         <button
//         onClick={()=>navigate('/all-doctors')}
//           className="bg-[#f5961d] px-6 py-2 flex items-center justify-center text-white rounded-[20px] cursor-pointer 
//                transform transition duration-300 hover:scale-105 hover:shadow-lg 
//                active:scale-95 active:shadow-inner"
//         >
//           More
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Doctors;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/users/doctors');
        setDoctors(response.data.doctors);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to fetch doctors');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [navigate]);

  return (
    <div className="  ">
      <div className=" flex items-center justify-center flex-col ">
        <h1 className="font-medium text-[30px] text-center pt-20 px-6 pb-4">
          Explore by Specialties
        </h1>
        <p className="text-center max-w-[500px] pb-8 mx-auto text-gray-600">
          Find the right doctor by choosing from a wide range of medical
          specialties tailored to your needs.
        </p>
      </div>
      <div className="flex justify-center ">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            doctors.slice(0, 10).map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => navigate(`/doc-bio/${doctor._id}`)}
                className=" cursor-pointer border w-[300px] sm:w-[200px] rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-inner"
              >
                <div className="bg-[#c2c2c2]">
                  {doctor.profilePic ? (
                    <img src={`http://localhost:5000${doctor.profilePic}`} alt={doctor.name} className="w-full" />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-300 text-2xl font-bold text-gray-600">
                      {doctor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center p-3">
                  <h1 className="text-green-500 text-[10px]">Available</h1>
                  <h1 className="font-medium">{doctor.name}</h1>
                  <p className="text-[#6c6c6c] text-[13px]">{doctor.specialty || 'N/A'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex items-center justify-center py-10">
        <button
          onClick={() => navigate('/all-doctors')}
          className="bg-[#f5961d] px-6 py-2 flex items-center justify-center text-white rounded-[20px] cursor-pointer 
               transform transition duration-300 hover:scale-105 hover:shadow-lg 
               active:scale-95 active:shadow-inner"
        >
          More
        </button>
      </div>
    </div>
  );
};

export default Doctors;
