import React from "react";
import { ArrowLeft } from "lucide-react";

const UserDetails = ({ user, onBack }) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft size={18} />
        Back to {user.role === "doctor" ? "Doctors" : "Patients"}
      </button>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        {user.name}'s Details
      </h2>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {user.profilePic ? (
              <img
                src={`http://localhost:5000${user.profilePic}`}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold mb-4">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(user.dob).toLocaleDateString()}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <p>
              <strong>Status:</strong> {user.status}
            </p>
            {user.role === "doctor" && (
              <>
                <p>
                  <strong>Specialty:</strong> {user.specialty || "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong> {user.experience || "N/A"}
                </p>
                <p>
                  <strong>About:</strong> {user.about || "N/A"}
                </p>
                <p>
                  <strong>Appointment Fee:</strong> $
                  {user.appointmentFee || "N/A"}
                </p>
                <p>
                  <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
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
