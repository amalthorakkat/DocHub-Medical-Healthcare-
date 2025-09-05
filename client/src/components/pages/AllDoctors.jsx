// import React, { useState } from "react";
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
// import { useNavigate } from "react-router-dom";

// const AllDoctors = () => {
//   const navigate = useNavigate();
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

//   const specialties = ["All", ...new Set(doctors.map((d) => d.specialty))];
//   const [selectedSpecialty, setSelectedSpecialty] = useState("All");

//   const filteredDoctors =
//     selectedSpecialty === "All"
//       ? doctors
//       : doctors.filter((doctor) => doctor.specialty === selectedSpecialty);

//   return (
//     <div className="min-h-screen bg-gray-100 pt-[110px]">
//       <div className="container mx-auto px-4 py-10">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Filter Section */}
//           <div className="lg:w-1/4">
//             <div className="bg-white p-6 rounded-xl shadow-md sticky top-[140px]">
//               <h2 className="text-xl font-semibold mb-4">
//                 Filter by Specialty
//               </h2>
//               <div className="flex flex-col gap-2">
//                 {specialties.map((specialty, index) => (
//                   <button
//                     key={index}
//                     className={`w-full text-left px-4 py-2 rounded-lg font-medium
//                       ${
//                         selectedSpecialty === specialty
//                           ? "bg-[#f5961d] text-white"
//                           : "bg-gray-200 text-gray-700"
//                       }
//                       hover:bg-[#f5961d] hover:text-white transition duration-300`}
//                     onClick={() => setSelectedSpecialty(specialty)}
//                   >
//                     {specialty}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Doctors Section */}
//           <div className="flex justify-center items-center">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {filteredDoctors.map((doctor, index) => (
//                 <div
//                   key={index}
//                   onClick={() => navigate("/doc-bio")}
//                   className="cursor-pointer border w-[300px] sm:w-[200px] rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-inner"
//                 >
//                   <div className="bg-[#c2c2c2]">
//                     <img
//                       src={doctor.image}
//                       alt={doctor.name}
//                       className="w-full"
//                     />
//                   </div>
//                   <div className="text-center p-3">
//                     <h1 className="text-green-500 text-sm">Available</h1>
//                     <h1 className="font-medium">{doctor.name}</h1>
//                     <p className="text-gray-600 text-sm">{doctor.specialty}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllDoctors;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../utils/axiosInstance';
// import toast from 'react-hot-toast';

// const AllDoctors = () => {
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSpecialty, setSelectedSpecialty] = useState('All');

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axiosInstance.get('/admin/doctors');
//         setDoctors(response.data.doctors);
//       } catch (err) {
//         toast.error(err.response?.data?.error || 'Failed to fetch doctors');
//         if (err.response?.status === 401 || err.response?.status === 403) {
//           navigate('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctors();
//   }, [navigate]);

//   const specialties = ['All', ...new Set(doctors.map((d) => d.specialty).filter(Boolean))];
//   const filteredDoctors =
//     selectedSpecialty === 'All'
//       ? doctors
//       : doctors.filter((doctor) => doctor.specialty === selectedSpecialty);

//   return (
//     <div className="min-h-screen bg-gray-100 pt-[110px]">
//       <div className="container mx-auto px-4 py-10">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Filter Section */}
//           <div className="lg:w-1/4">
//             <div className="bg-white p-6 rounded-xl shadow-md sticky top-[140px]">
//               <h2 className="text-xl font-semibold mb-4">
//                 Filter by Specialty
//               </h2>
//               <div className="flex flex-col gap-2">
//                 {specialties.map((specialty, index) => (
//                   <button
//                     key={index}
//                     className={`w-full text-left px-4 py-2 rounded-lg font-medium
//                       ${
//                         selectedSpecialty === specialty
//                           ? 'bg-[#f5961d] text-white'
//                           : 'bg-gray-200 text-gray-700'
//                       }
//                       hover:bg-[#f5961d] hover:text-white transition duration-300`}
//                     onClick={() => setSelectedSpecialty(specialty)}
//                   >
//                     {specialty}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Doctors Section */}
//           <div className="flex justify-center items-center">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {loading ? (
//                 <div className="col-span-full text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
//                 </div>
//               ) : filteredDoctors.length === 0 ? (
//                 <div className="col-span-full text-center text-gray-600">
//                   No doctors found for this specialty
//                 </div>
//               ) : (
//                 filteredDoctors.map((doctor) => (
//                   <div
//                     key={doctor._id}
//                     onClick={() => navigate(`/doc-bio/${doctor._id}`)}
//                     className="cursor-pointer border w-[300px] sm:w-[200px] rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-inner"
//                   >
//                     <div className="bg-[#c2c2c2]">
//                       {doctor.profilePic ? (
//                         <img
//                           src={`http://localhost:5000${doctor.profilePic}`}
//                           alt={doctor.name}
//                           className="w-full"
//                         />
//                       ) : (
//                         <div className="w-full h-40 flex items-center justify-center bg-gray-300 text-2xl font-bold text-gray-600">
//                           {doctor.name.charAt(0)}
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-center p-3">
//                       <h1 className="text-green-500 text-sm">Available</h1>
//                       <h1 className="font-medium">{doctor.name}</h1>
//                       <p className="text-gray-600 text-sm">{doctor.specialty || 'N/A'}</p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllDoctors;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const AllDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/users/doctors");
        setDoctors(response.data.doctors);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to fetch doctors");
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [navigate]);

  const specialties = [
    "All",
    ...new Set(doctors.map((d) => d.specialty).filter(Boolean)),
  ];
  const filteredDoctors =
    selectedSpecialty === "All"
      ? doctors
      : doctors.filter((doctor) => doctor.specialty === selectedSpecialty);

  return (
    <div className="min-h-screen bg-gray-100 pt-[110px]">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-[140px]">
              <h2 className="text-xl font-semibold mb-4">
                Filter by Specialty
              </h2>
              <div className="flex flex-col gap-2">
                {specialties.map((specialty, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium
                      ${
                        selectedSpecialty === specialty
                          ? "bg-[#f5961d] text-white"
                          : "bg-gray-200 text-gray-700"
                      }
                      hover:bg-[#f5961d] hover:text-white transition duration-300`}
                    onClick={() => setSelectedSpecialty(specialty)}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="col-span-full text-center text-gray-600">
                  No doctors found for this specialty
                </div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => navigate(`/doc-bio/${doctor._id}`)}
                    className="cursor-pointer border w-[300px] sm:w-[200px] rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-inner"
                  >
                    <div className="bg-[#c2c2c2]">
                      {doctor.profilePic ? (
                        <img
                          src={`http://localhost:5000${doctor.profilePic}`}
                          alt={doctor.name}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-300 text-2xl font-bold text-gray-600">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-center p-3">
                      <h1 className="text-green-500 text-sm">Available</h1>
                      <h1 className="font-medium">{doctor.name}</h1>
                      <p className="text-gray-600 text-sm">
                        {doctor.specialty || "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
