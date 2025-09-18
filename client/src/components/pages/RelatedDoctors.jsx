import React from "react";
import { useNavigate } from "react-router-dom";
import Transition from "../../animations/Transition";
import FadeContent from "../../animations/FadeContent";

const RelatedDoctors = ({ doctors, loading, specialty }) => {
  const navigate = useNavigate();

  return (
    <div className="py-12">
      {/* Heading */}
      <Transition distance={30} duration={1.5} delay={0.3}>
        <div className="flex items-center justify-center flex-col">
          <h1 className="font-medium text-[30px] text-center px-6 pb-4">
            Related Doctors
          </h1>
          <p className="text-center max-w-[500px] pb-8 mx-auto text-gray-600">
            Explore other specialists in {specialty || "this field"} to find the
            right doctor for your needs.
          </p>
        </div>
      </Transition>

      {/* Cards */}
      <FadeContent blur={true} delay={200}>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {loading ? (
              <div className="col-span-full text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading related doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="col-span-full text-center">
                <p className="text-gray-600">No related doctors found</p>
              </div>
            ) : (
              doctors.slice(0, 5).map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => navigate(`/doc-bio/${doctor._id}`)}
                  className="cursor-pointer border w-[300px] sm:w-[200px] rounded-lg shadow-sm overflow-hidden 
                           transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-105 
                           active:scale-95 active:shadow-inner flex flex-col"
                >
                  {/* Image */}
                  <div className="bg-[#c2c2c2]">
                    {doctor.profilePic ? (
                      <img
                        src={`http://localhost:5000${doctor.profilePic}`}
                        alt={doctor.name}
                        className="w-full"
                        onError={(e) => {
                          console.error("Image load error for doctor:", {
                            doctorId: doctor._id,
                            profilePic: doctor.profilePic,
                          });
                          e.target.src = `https://via.placeholder.com/150?text=${doctor.name.charAt(
                            0
                          )}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-300 text-2xl font-bold text-gray-600">
                        {doctor.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center p-3">
                    <h1 className="text-green-500 text-[10px]">Available</h1>
                    <h1 className="font-medium">{doctor.name}</h1>
                    <p className="text-[#6c6c6c] text-[13px]">
                      {doctor.specialty || "N/A"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </FadeContent>
    </div>
  );
};

export default RelatedDoctors;
