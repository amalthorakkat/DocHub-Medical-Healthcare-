import React from "react";
import { ArrowLeft } from "lucide-react";

const UserDetails = ({ user, onBack }) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-[#F5961D] hover:text-[#D87D17] font-medium transition-all duration-200"
      >
        <ArrowLeft size={20} />
        Back to {user.role === "doctor" ? "Doctors" : "Patients"}
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {user.name}'s Details
      </h2>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {user.profilePic ? (
              <img
                src={`http://localhost:5000${user.profilePic}`}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600 mb-4 border border-gray-200">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong className="font-semibold">Name:</strong> {user.name}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Email:</strong> {user.email}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Date of Birth:</strong>{" "}
              {new Date(user.dob).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Role:</strong>{" "}
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Status:</strong> {user.status}
            </p>
            {user.role === "doctor" && (
              <>
                <p className="text-gray-700">
                  <strong className="font-semibold">Specialty:</strong>{" "}
                  {user.specialty || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold">Experience:</strong>{" "}
                  {user.experience || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold">About:</strong>{" "}
                  {user.about || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold">Appointment Fee:</strong> $
                  {user.appointmentFee || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold">Verified:</strong>{" "}
                  {user.isVerified ? "Yes" : "No"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
