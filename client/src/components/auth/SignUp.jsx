

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import { Toaster, toast } from "react-hot-toast";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateName = (name) => name.length >= 2;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validateDOB = (dob) => {
    const date = new Date(dob);
    const today = new Date();
    return date < today && !isNaN(date);
  };

  const handleSignUp = async () => {
    const newErrors = {};
    if (!validateName(name))
      newErrors.name = "Name must be at least 2 characters";
    if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!validatePassword(password))
      newErrors.password = "Password must be at least 8 characters";
    if (!validateDOB(dob)) newErrors.dob = "Invalid date of birth";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axiosInstance.post("/users/register", {
          name,
          email,
          password,
          dob,
        });
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token,
        }));
        toast.success("Signup successful!", {
          position: "bottom-right",
          duration: 3000,
        });
        navigate("/");
      } catch (err) {
        const errorMessage = err.response?.data?.error || "Signup failed";
        toast.error(errorMessage, {
          position: "bottom-right",
          duration: 4000,
        });
        setErrors({ server: errorMessage });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-[140px] mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-900">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Sign Up
      </h2>
      <div className="mb-4">
        <label className="block text-gray-900 mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7971E] ${
            errors.name ? "border-red-500" : "border-gray-900"
          }`}
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-900 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7971E] ${
            errors.email ? "border-red-500" : "border-gray-900"
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-900 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7971E] ${
            errors.password ? "border-red-500" : "border-gray-900"
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-900 mb-2">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7971E] ${
            errors.dob ? "border-red-500" : "border-gray-900"
          }`}
        />
        {errors.dob && (
          <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
        )}
      </div>
      {errors.server && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {errors.server}
        </p>
      )}
      <button
        onClick={handleSignUp}
        className="w-full bg-[#F7971E] text-white py-2 rounded-md hover:bg-[#e08a1b] transition-all duration-300"
      >
        Sign Up
      </button>
      <p className="text-center mt-4 text-gray-900">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#F7971E] hover:text-[#e08a1b] hover:underline transition-all duration-300"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
