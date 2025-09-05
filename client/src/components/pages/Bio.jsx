import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Bio = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear user and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear state
    setUser(null);

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-[140px] p-6 bg-white rounded-lg shadow-md border border-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        User Bio
      </h2>
      {user ? (
        <>
          <p className="text-gray-900">Name: {user.name}</p>
          <p className="text-gray-900">Email: {user.email}</p>
          <p className="text-gray-900">Role: {user.role}</p>
          <p className="text-gray-900">
            Date of Birth: {new Date(user.dob).toLocaleDateString()}
          </p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-red-500">User data not found. Please log in.</p>
      )}
    </div>
  );
};

export default Bio;
