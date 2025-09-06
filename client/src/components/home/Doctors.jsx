


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


