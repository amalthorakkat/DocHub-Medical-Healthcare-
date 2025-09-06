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
