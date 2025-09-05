

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!validatePassword(password))
      newErrors.password = "Password must be at least 8 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      );
      toast.success("Logged in successfully", {
        position: "bottom-right",
        duration: 3000,
      });
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      toast.error(errorMessage, {
        position: "bottom-right",
        duration: 4000,
      });
      setErrors({ server: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          {errors.server && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {errors.server}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-[#F7971E] hover:bg-[#e08a1b]"
            } transition-all duration-300`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#F7971E] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
