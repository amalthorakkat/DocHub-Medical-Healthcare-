


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { Users, Stethoscope, LogOut } from "lucide-react";
import UserDetails from "./UserDetails";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    role: activeTab === "doctors" ? "doctor" : "patient",
    specialty: "",
    experience: "",
    about: "",
    appointmentFee: "",
    profilePic: null,
  });
  const [editUserId, setEditUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const specialties = [
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "General physician",
    "Gastroenterologist",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const patientResponse = await axiosInstance.get(
          "/users/admin/patients"
        );
        console.log("Patients Response:", patientResponse.data); // Debug
        setPatients(patientResponse.data.patients || []);
        const doctorResponse = await axiosInstance.get("/users/admin/doctors");
        console.log("Doctors Response:", doctorResponse.data); // Debug
        setDoctors(doctorResponse.data.doctors || []);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message); // Debug
        const errorMessage =
          err.response?.data?.error ||
          "Failed to fetch data. Please check server connectivity.";
        toast.error(errorMessage);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: activeTab === "doctors" ? "doctor" : "patient",
      specialty: activeTab === "doctors" ? prev.specialty : "",
      experience: activeTab === "doctors" ? prev.experience : "",
      about: activeTab === "doctors" ? prev.about : "",
      appointmentFee: activeTab === "doctors" ? prev.appointmentFee : "",
    }));
  }, [activeTab]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!editUserId && (!formData.password || formData.password.length < 8))
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.dob || new Date(formData.dob) >= new Date())
      newErrors.dob = "Invalid date of birth";
    if (formData.role === "doctor") {
      if (!formData.specialty)
        newErrors.specialty = "Specialty is required for doctors";
      if (!formData.experience)
        newErrors.experience = "Experience is required for doctors";
      if (!formData.about) newErrors.about = "About is required for doctors";
      if (
        !formData.appointmentFee ||
        isNaN(formData.appointmentFee) ||
        formData.appointmentFee <= 0
      )
        newErrors.appointmentFee = "Valid appointment fee is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "")
        form.append(key, formData[key]);
    }

    try {
      if (editUserId) {
        await axiosInstance.put(`/users/admin/users/${editUserId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User updated successfully");
      } else {
        await axiosInstance.post("/users/admin/users", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User created successfully");
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        dob: "",
        role: activeTab === "doctors" ? "doctor" : "patient",
        specialty: "",
        experience: "",
        about: "",
        appointmentFee: "",
        profilePic: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setEditUserId(null);
      setErrors({});
      const patientResponse = await axiosInstance.get("/users/admin/patients");
      console.log("Patients Response (after update):", patientResponse.data); // Debug
      setPatients(patientResponse.data.patients || []);
      const doctorResponse = await axiosInstance.get("/users/admin/doctors");
      console.log("Doctors Response (after update):", doctorResponse.data); // Debug
      setDoctors(doctorResponse.data.doctors || []);
    } catch (err) {
      console.error("Save User Error:", err.response?.data || err.message); // Debug
      toast.error(err.response?.data?.error || "Failed to save user");
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      role: user.role || (activeTab === "doctors" ? "doctor" : "patient"),
      specialty: user.specialty || "",
      experience: user.experience || "",
      about: user.about || "",
      appointmentFee: user.appointmentFee || "",
      profilePic: null,
    });
    setEditUserId(user._id);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/users/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setPatients(patients.filter((user) => user._id !== userId));
      setDoctors(doctors.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Delete User Error:", err.response?.data || err.message); // Debug
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleDeleteProfilePic = async (userId) => {
    if (!window.confirm("Are you sure you want to delete the profile picture?"))
      return;
    try {
      await axiosInstance.delete(`/users/admin/users/${userId}/profile-pic`);
      toast.success("Profile picture deleted successfully");
      setPatients(
        patients.map((user) =>
          user._id === userId ? { ...user, profilePic: null } : user
        )
      );
      setDoctors(
        doctors.map((user) =>
          user._id === userId ? { ...user, profilePic: null } : user
        )
      );
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, profilePic: null });
      }
    } catch (err) {
      console.error(
        "Delete Profile Pic Error:",
        err.response?.data || err.message
      ); // Debug
      toast.error(
        err.response?.data?.error || "Failed to delete profile picture"
      );
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const handleDoctorVerification = async (doctorId) => {
    try {
      await axiosInstance.put(`/users/admin/doctors/${doctorId}/verify`);
      toast.success("Doctor verified successfully");
      setDoctors(
        doctors.map((doctor) =>
          doctor._id === doctorId ? { ...doctor, isVerified: true } : doctor
        )
      );
    } catch (err) {
      console.error("Verify Doctor Error:", err.response?.data || err.message); // Debug
      toast.error(err.response?.data?.error || "Failed to verify doctor");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const menuItems = [
    { key: "patients", label: "Patients", icon: <Users size={18} /> },
    { key: "doctors", label: "Doctors", icon: <Stethoscope size={18} /> },
  ];

  const renderContent = () => {
    if (selectedUser) {
      return <UserDetails user={selectedUser} onBack={handleBack} />;
    }

    switch (activeTab) {
      case "patients":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Patient Management
            </h2>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editUserId ? "Edit Patient" : "Add New Patient"}
              </h3>
              <form
                onSubmit={handleCreateOrUpdateUser}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.name ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.email ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">
                    Password {editUserId && "(Leave blank to keep unchanged)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.password ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.dob ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Select date of birth"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full px-3 py-2 border rounded-md border-gray-900"
                    accept="image/*"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all duration-300"
                  >
                    {editUserId ? "Update Patient" : "Add Patient"}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Patients List</h3>
              {patients.length === 0 ? (
                <p className="text-gray-600">No patients found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {user.profilePic ? (
                              <img
                                src={`http://localhost:5000${user.profilePic}`}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                {user.name.charAt(0)}
                              </div>
                            )}
                            <span
                              className="cursor-pointer hover:text-indigo-600"
                              onClick={() => handleViewDetails(user)}
                            >
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.status}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="mr-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                          {user.profilePic && (
                            <button
                              onClick={() => handleDeleteProfilePic(user._id)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              Delete Pic
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      case "doctors":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Doctor Management
            </h2>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editUserId ? "Edit Doctor" : "Add New Doctor"}
              </h3>
              <form
                onSubmit={handleCreateOrUpdateUser}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.name ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.email ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">
                    Password {editUserId && "(Leave blank to keep unchanged)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.password ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.dob ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Select date of birth"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">Specialty</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.specialty ? "border-red-500" : "border-gray-900"
                    }`}
                  >
                    <option value="" disabled>
                      Select specialty
                    </option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.specialty}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.experience ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter experience (e.g., 4 Years)"
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.experience}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.about ? "border-red-500" : "border-gray-900"
                    }`}
                    placeholder="Enter about the doctor"
                  />
                  {errors.about && (
                    <p className="text-red-500 text-sm mt-1">{errors.about}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">
                    Appointment Fee
                  </label>
                  <input
                    type="number"
                    name="appointmentFee"
                    value={formData.appointmentFee}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      errors.appointmentFee
                        ? "border-red-500"
                        : "border-gray-900"
                    }`}
                    placeholder="Enter appointment fee"
                  />
                  {errors.appointmentFee && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.appointmentFee}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full px-3 py-2 border rounded-md border-gray-900"
                    accept="image/*"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all duration-300"
                  >
                    {editUserId ? "Update Doctor" : "Add Doctor"}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Doctors List</h3>
              {doctors.length === 0 ? (
                <p className="text-gray-600">No doctors found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Specialty</th>
                      <th className="p-2 text-left">Verified</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor._id} className="border-b">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {doctor.profilePic ? (
                              <img
                                src={`http://localhost:5000${doctor.profilePic}`}
                                alt={doctor.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                {doctor.name.charAt(0)}
                              </div>
                            )}
                            <span
                              className="cursor-pointer hover:text-indigo-600"
                              onClick={() => handleViewDetails(doctor)}
                            >
                              {doctor.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">{doctor.email}</td>
                        <td className="p-2">{doctor.specialty || "N/A"}</td>
                        <td className="p-2">
                          {doctor.isVerified ? "Yes" : "No"}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleEditUser(doctor)}
                            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(doctor._id)}
                            className="mr-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                          {doctor.profilePic && (
                            <button
                              onClick={() => handleDeleteProfilePic(doctor._id)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              Delete Pic
                            </button>
                          )}
                          {!doctor.isVerified && (
                            <button
                              onClick={() =>
                                handleDoctorVerification(doctor._id)
                              }
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      default:
        return (
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome to Admin Panel
          </h2>
        );
    }
  };

  return (
    <div className="pt-[140px] px-[70px]">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white shadow-md p-4 rounded-lg">
        <div className="flex gap-3 flex-wrap">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-800 hover:bg-indigo-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
